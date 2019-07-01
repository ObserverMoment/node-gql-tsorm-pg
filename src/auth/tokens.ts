import jwt from 'jsonwebtoken'
import {getRepository} from 'typeorm'
import {AuthenticationError} from 'apollo-server'

import User from '../entity/roles/User'

interface VerifiedPayload {
  issuer?: string
  userId?: string
  audience?: string
  expiresIn?: string
  iat?: string
}

interface SignPayload {
  issuer: string
  subject: string
  audience: string
  expiresIn: string
}

export const generateAccessToken = async (userId: string | number): Promise<string> => {
  const signPayload: SignPayload = {
    issuer: process.env.ACCESS_TOKEN_ISSUER,
    subject: userId.toString(),
    audience: process.env.ACCESS_TOKEN_AUDIENCE,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  }
  try {
    const token = await jwt.sign(
      {userId},
      process.env.ACCESS_TOKEN_SECRET,
      signPayload
    )
    return token
  } catch (err) {
    console.log(err)
    throw Error('There was a problem generating the JWT access token')
  }
}

export const checkAccessToken = async (req): Promise<User> => {
  const authHeader: string = req.headers['authorization'] as string
  if (!authHeader) {
    return null
  }
  if (authHeader.substring(0, 7) !== 'Bearer ') {
    throw new AuthenticationError('Access token header not correctly formatted')
  }

  const accessToken: string = authHeader.substring(7, authHeader.length)
  const decodedPayload: VerifiedPayload | string = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

  if (!decodedPayload || typeof decodedPayload === 'string') {
    throw new AuthenticationError('Access token not valid - token not found or type is not string')
  }

  const user = await getRepository(User)
    .createQueryBuilder('user')
    .where('user.id = :userId', {userId: parseInt(decodedPayload.userId)})
    .addSelect('user.tokenValidAfter') // Required due to { select: false } option in the entity class.
    .getOne()

  if (!user) {
    throw new AuthenticationError('Access token not valid - no associated user found')
  }
  // Check that the iat on the token is not before User.tokenValidAfter date from DB - jwt.iat is time from epoch in s, not ms.
  if (new Date(decodedPayload.iat).valueOf() * 1000 <= new Date(user.tokenValidAfter).valueOf()) {
    throw new AuthenticationError('This access token is no longer valid. Delete it and ask the user to login.')
  }
  delete user.tokenValidAfter // We don't want to serialize this!!
  return user
}
