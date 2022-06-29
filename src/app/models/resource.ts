import {User} from "./user";

export class Resource {
  public id?: number
  public author?: User
  public title?: string
  public views?: number
  public richTextContent?: string
  public mediaUrl?: []
  public isExploited?: boolean
  public status?: string
  public scope?: EScope
  public type?: string
  public category?: string
  public createdAt?: Date
  public updatedAt?: Date
  public deletedAt?: Date

  constructor() {
  }
}

export enum EScope {
  PUBLIC = 'public',
  SHARED = 'shared',
  PRIVATE = 'private'
}

export enum EStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export const STATUS_LABELS = new Map<EStatus, string>([
  [EStatus.PENDING, 'À valider'],
  [EStatus.ACCEPTED, 'Validée'],
  [EStatus.REJECTED, 'Rejetée'],
])

export const SCOPE_LABELS = new Map<EScope, string>([
  [EScope.PUBLIC, 'Publique'],
  [EScope.SHARED, 'Partagée'],
  [EScope.PRIVATE, 'Privée'],
])
