import * as otplib from 'otplib'
import qr from 'qrcode'
import User from '../entity/roles/User'
import {getRepository} from 'typeorm'
import {AuthenticationError} from 'apollo-server'
import scrypt from 'scrypt'
import {encrypt, decrypt} from './crypto'
import {generateAccessToken} from '../auth/tokens'

// .addSelect() gets fields that are not serialisec by default - and are used for auth only.
// For single factor auth.
export const getUserForAuthByEmail = async (email) => {
  const userForAuth = await getRepository(User)
    .createQueryBuilder('user')
    .where('user.email = :email', {email})
    .addSelect(['user.password', 'user.accountLocked', 'user.twoFactorEnabled'])
    .getOne()
  if (!userForAuth) {
    throw new AuthenticationError(`Could not find a user under email: ${email}.`)
  }
  return userForAuth
}

// For 2 factor auth
export const getUserForAuthById = async (id) => {
  const userForAuth = await getRepository(User)
    .createQueryBuilder('user')
    .where('user.id = :id', {id})
    .addSelect(['user.accountLocked', 'user.twoFactorEnabled', 'user.password', 'user.otpk'])
    .getOne()
  if (!userForAuth) {
    throw new AuthenticationError(`Could not find a user with id: ${id}.`)
  }
  return userForAuth
}

export const checkPassword = (password, passwordHash) => scrypt.verifyKdfSync(Buffer.from(passwordHash, 'base64'), password)

export const loginSingleFactor = async (email, password) => {
  const user = await getUserForAuthByEmail(email)
  if (!user) {
    throw new AuthenticationError('There is no account associated with that email address.')
  }
  if (user.accountLocked) {
    throw new AuthenticationError('Sorry, this account has been locked due to security reasons. Please contact support.')
  }

  const passwordValid = checkPassword(password, user.password)
  if (!passwordValid) {
    throw new AuthenticationError('Sorry, the email and password combination was not correct.')
  }

  // All checks passed. Make a token. The type: 'grant' claim on the token will cause the client to redirect the user to 2FA login screen.
  const type = user.twoFactorEnabled ? 'grant' : 'access'
  const token = await generateAccessToken(user.id, 1, type) // 1 here is the access 'level' - i.e. single factor authed only.
  return token
}

export const enrolTwoFactor = async (userId, password) => {
  const user = await getUserForAuthById(userId)
  const passwordValid = checkPassword(password, user.password)
  if (!passwordValid) {
    throw new AuthenticationError('The password entered was not correct.')
  }
  if (user.otpk || user.twoFactorEnabled) {
    throw new AuthenticationError('You are already enrolled for two factor authentication.')
  }

  // Generate secret.
  const secret = otplib.authenticator.generateSecret() // base 32 encoded hex secret key.

  // Encrypt it and save to user.otpk as string 'iv.encrypted'
  // aes-256-cbc wants a 16 byte IV.
  const encryptedOtpk = encrypt(secret, process.env.CRYPTO_SECRET_2FA, 16, 'aes-256-cbc', 'hex')

  const updateUser = {
    ...user,
    twoFactorEnabled: true,
    otpk: encryptedOtpk
  }
  const savedUser = await getRepository(User).save(updateUser)

  // New token with type of 'grant' and level of 2.
  const token = await generateAccessToken(savedUser.id, 2, 'grant')

  // Generate QR code.
  const otpauth = otplib.authenticator.keyuri(savedUser.email, 'Procure.it', secret) // user, service, secret to pass to device auth app.
  const dataURL = await qr.toDataURL(otpauth)
  return {dataURL, token}
}

export const loginTwoFactor = async (userId, code) => {
  const user = await getUserForAuthById(userId)
  if (user.accountLocked) {
    throw new AuthenticationError('Sorry, this account has been locked due to security reasons. Please contact support.')
  }
  if (!user.twoFactorEnabled) {
    throw new AuthenticationError('You need to enrol for two factor authentication before trying to login with it.')
  }
  // Decrypt otpk
  const [ivHex, encryptedKeyHex] = user.otpk.split('.')
  const key = decrypt(encryptedKeyHex, Buffer.from(process.env.CRYPTO_SECRET_2FA, 'hex'), ivHex, 'aes-256-cbc', 'hex')

  // Allow one window of timing error either side of that implied as current by the client. 30 seconds window each side.
  otplib.authenticator.options = {
    step: 30,
    window: 1
  }

  // Verify user access code using the descrypted key.
  if (otplib.authenticator.check(code, key)) {
    const token = await generateAccessToken(userId, 2, 'access') // 2 here is the access 'level' - i.e. two factor authed.
    return token
  } else {
    throw new AuthenticationError('Sorry, the access code supplied was not valid, pleasse try again.')
  }
}
