declare namespace Express {
   export interface Request {
      userId?: string | String
   }
}

declare namespace Express {
   export interface Response {
      freshToken?: string | String
   }
}
