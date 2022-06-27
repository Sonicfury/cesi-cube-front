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

export interface Paginated<T> {
  "current_page": number
  "data": T[]
  "first_page_url": string
  "from": number
  "last_page": number | null
  "last_page_url": string | null
  "links": { url: string, label: string, active: boolean }[]
  "next_page_url": string | null
  "path": string
  "per_page": number
  "prev_page_url": string | null
  "to": number
  "total": number
}
