
type UserPayload = {
  id: number,
  email: string,
  active: boolean,
  name: string
}

declare namespace Express {
  export interface Request {
     user?: UserPayload
  }
}