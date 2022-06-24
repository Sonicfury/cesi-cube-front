import {User} from "./user";

export interface LaravelResponse<T> {
  success: string
  data: T
  message: string
}

export interface AuthData {
  token: string
  user: User
}
