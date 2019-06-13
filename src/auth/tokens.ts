import jwt from 'jsonwebtoken'

interface VerifiedPayload {
  issuer?: string
  subject?: string
  audience?: string
  expiresIn?: string
}

interface SignPayload {
  issuer: string
  subject: string
  audience: string
  expiresIn: string
}

export const generateAccessToken = async (userId: string) => {
  const signPayload: SignPayload = {
    issuer: process.env.ACCESS_TOKEN_ISSUER,
    subject: userId.toString(),
    audience: process.env.ACCESS_TOKEN_AUDIENCE,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  }
  try {
    const token = await jwt.sign(
      { userId },
      process.env.ACCESS_TOKEN_SECRET,
      signPayload
    )
    return token as string
  } catch (err) {
    console.log(err)
    throw Error('There was a problem generating the JWT access token')
  }
}

export const checkAccessToken = (req: any) => {
  const authHeader = req.headers['x-access-token'] || req.headers['authorization'] // Express headers are auto converted to lowercase
  if (!authHeader) {
    return null // For non registered or none logged in users apollo server context.userId will be null. They can view unprotected resources.
  }
  if (!authHeader.StartsWith('Bearer ')) {
    throw Error('Access token header not correctly formatted')
  }
  try {
    const accessToken = authHeader.substring(7, authHeader.length)
    const decodedPayload: VerifiedPayload | string = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    console.log('decodedPayload', decodedPayload)

    if (typeof decodedPayload === 'string') {
      throw Error('Access token not valid')
    }
    // Token is valid and not expired.
    // TODO: Check that the iat on the token is not before User.tokenValidIfAfter date from DB

    return decodedPayload.subject
  } catch (err) {
    console.log(err)
    return null
  }
}
