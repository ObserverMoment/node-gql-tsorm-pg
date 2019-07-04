import User from '../entity/roles/User'
import {getRepository} from 'typeorm'
import {AuthenticationError} from 'apollo-server'
import scrypt from 'scrypt'

export const getUserForAuth = async (email) => {
  const userForAuth = await getRepository(User)
    .createQueryBuilder('user')
    .where('user.email = :email', {email})
    .addSelect('user.password')
    .addSelect('user.accountLocked')
    .getOne()
  return userForAuth
}

export const loginStandard = async (email, password) => {
  const user = await getUserForAuth(email)
  if (!user) {
    throw new AuthenticationError('There is no account associated with that email address')
  }
  const accountLocked = user.accountLocked !== 0
  if (accountLocked) {
    throw new AuthenticationError('Sorry, this account has been locked due to security reasons. Please contact customer support.')
  }
  const twoFactorEnabled = user.twoFactorEnabled === 1
  if (twoFactorEnabled) {
    throw new AuthenticationError('Two factor authentication is enabled, standard authentication will not work')
  }
  const passwordValid = scrypt.verifyKdfSync(Buffer.from(user.password, 'base64'), password)
  if (!passwordValid) {
    throw new AuthenticationError('The password entered was not correct')
  }
  delete user.password // We don't want to serialize the password!
  delete user.accountLocked // We don't want to serialize accountLocked!
  return user
}

export const loginTwoFactor = async (email, password, totpCode) => {
  const user = await getUserForAuth(email)
  if (!user) {
    throw new AuthenticationError('There is no account associated with that email address')
  }
  const accountLocked = user.accountLocked !== 0
  if (accountLocked) {
    throw new AuthenticationError('Sorry, this account has been locked due to security reasons. Please contact customer support.')
  }
  const passwordValid = scrypt.verifyKdfSync(Buffer.from(user.password, 'base64'), password)
  if (!passwordValid) {
    throw new AuthenticationError('The password entered was not correct')
  }
  const twoFactorEnabled = user.twoFactorEnabled === 1
  if (!twoFactorEnabled) {
    throw new AuthenticationError('You have not enabled two factor authentication on your account')
  }
}
