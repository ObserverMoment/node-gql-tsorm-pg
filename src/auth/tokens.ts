import jwt from 'jsonwebtoken'

interface JWTPayload {
  userId?: String
}

export const generateAccessToken = async (userId: string | number) => {
  return await jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}

export const generateRefreshToken = async (userId: string | number) => {
  return await jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
}

export const getTokens = (userId: string | number) => ({
  accessToken: generateAccessToken(userId),
  refreshToken: generateRefreshToken(userId)
})

export const refreshTokens = () => {

}

export const checkAccessToken = (cookies: Object) => {
  const accessToken = cookies[process.env.ACCESS_TOKEN_KEY_NAME]
  if (!accessToken) {
    console.log('No access token')
    return null // For non registered or none logged in users apollo server context will be null.
  }
  try {
    const decoded: JWTPayload | string = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    if (typeof decoded === 'string') {
      throw Error('Access token not valid')
    }
    return decoded.userId
  } catch (err) {
    console.log(err)
    return null
  }
}
