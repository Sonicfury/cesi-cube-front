export interface LaravelResponse<T> {
  success: string
  data: T
  message: string
}

export interface AuthData {
  token: string
  id: string
}
