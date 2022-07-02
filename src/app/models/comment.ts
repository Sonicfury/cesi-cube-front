import {User} from "./user";

export class Comment {
  public id?: number
  public content?: string
  public author?: User
  public createdAt?: Date
  public updatedAt?: Date
}
