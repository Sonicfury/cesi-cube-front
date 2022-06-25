export class User {
  public id?: string
  public email?: string
  public avatar?: string|File
  public password?: string
  public lastname?: string
  public firstname?: string
  public address1?: string
  public zipCode?: string
  public city?: string
  public primaryPhone?: string
  public secondaryPhone?: string
  public address2?: string
  public birthDate?: Date
  public createdAt?: Date
  public updatedAt?: Date

  constructor() {
  }
}
