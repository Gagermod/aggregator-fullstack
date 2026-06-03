export interface IUser {
  id: string
  login: string
}

export interface RequestWithUser extends Request {
  user: IUser
}
