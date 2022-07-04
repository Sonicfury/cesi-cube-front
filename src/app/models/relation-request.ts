import {User} from "./user";
import {EStatus} from "./status";

export class RelationRequest {
  public id?: number
  public status?: EStatus
  public firstUser?: User
  public secondUser?: User
  public createdAt?: Date
  public updatedAt?: Date

  constructor() {
  }
}
