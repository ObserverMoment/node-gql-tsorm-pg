import otplib from 'otplib'
import User from '../entity/roles/User'
import {getRepository} from 'typeorm'
import {AuthenticationError} from 'apollo-server'
import scrypt from 'scrypt'
import {decrypt} from './crypto'
import {generateAccessToken} from '../auth/tokens'

// .addSelect() gets fields that are not serialisec by default - and are used for auth only.
// For single factor auth.
export const getUserForAuthByEmail = async (email) => {
  const userForAuth = await getRepository(User)
    .createQueryBuilder('user')
    .where('user.email = :email', {email})
    .addSelect('user.password')
    .addSelect('user.accountLocked')
    .addSelect('user.twoFactorEnabled')
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
    .addSelect('user.accountLocked')
    .addSelect('user.twoFactorEnabled')
    .addSelect('user.otpk')
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
    throw new AuthenticationError('The password entered was not correct.')
  }

  // All checks passed. Make a token. The type: 'grant' claim on the token will cause the client to redirect the user to 2FA login screen.
  const type = user.twoFactorEnabled ? 'grant' : 'access'
  const token = await generateAccessToken(user.id, 1, type) // 1 here is the access 'level' - i.e. single factor authed only.
  return token
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
  const key = decrypt(encryptedKeyHex, ivHex, 'hex', 'aes-256-gcm')

  // Allow one window of timing error either side of that implied by the client. 30 seconds window each side.
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
