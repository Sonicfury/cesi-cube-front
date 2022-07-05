import {User} from "./user";
import {Type} from "./type";
import {Category} from "./category";
import {Comment} from "./comment";
import {RelationType} from "./relation-type";

export class Resource {
  public id?: number
  public author?: User
  public title?: string
  public views?: number
  public richTextContent?: string
  public mediaUrl?: string
  public status?: string
  public type?: Type
  public relationTypes: RelationType[] = []
  public comments: Comment[] = []
  public exploited: {id: number}[] = []
  public favorites: {id: number}[] = []
  public readLater: {id: number}[] = []
  public category?: Category
  public createdAt?: Date
  public updatedAt?: Date
  public deletedAt?: Date

  constructor() {
  }
}
