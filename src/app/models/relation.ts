import {User} from "./user";
import {ERelationType} from "./relation-type";

export class Relation {
  public id?: number
  public isAccepted?: boolean | number = 0
  public relationType?: ERelationType
  public firstUser?: User
  public secondUser?: User
  public createdAt?: Date
  public updatedAt?: Date

  constructor() {
  }
}




