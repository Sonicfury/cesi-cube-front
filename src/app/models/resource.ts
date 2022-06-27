import {User} from "./user";

export class Resource {

  constructor(
    public id: number,
    public author: User,
    public title: string,
    public views: number,
    public richTextContent: string,
    public mediaUrl: [],
    public tags: string,
    public isExploited: string,
    public status: string,
    public scope: EScope,
    public typeId: bigint,
    public categoryId: bigint,
    public createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date
  ) {
  }
}

export enum EScope {
  PUBLIC = 'public',
  SHARED = 'shared',
  PRIVATE = 'private'
}

export const SCOPE_LABELS = new Map<EScope, string>([
  [EScope.PUBLIC, 'Publique'],
  [EScope.SHARED, 'Partagée'],
  [EScope.PRIVATE, 'Privée'],
])
