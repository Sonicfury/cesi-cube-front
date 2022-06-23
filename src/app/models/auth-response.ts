export interface AuthResponse {
  success: string
  data: { token: string, [key: string]: any }
  message: string
}
