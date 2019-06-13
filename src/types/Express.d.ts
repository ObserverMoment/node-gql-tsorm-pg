// Extending Express interface types.
declare namespace Express {
  interface Request {
      userId?: string
    }
  interface Response {
    freshToken?: string
  }
}
