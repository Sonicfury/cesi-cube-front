export class Role {
  public id?: number
  public guardName?: string
  public name?: ERole
  public createdAt?: Date
  public updatedAt?: Date

  constructor() {
  }
}

export enum ERole {
  SUPER_ADMIN = 'super-admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'citizen',
  GUEST = ''
}
