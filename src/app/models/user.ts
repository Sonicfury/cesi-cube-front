export class User {

  constructor(
    public id: number,
    public email: string,
    public roles: string[],
    public createdAt: Date,
    public lastUpdatedAt: Date
  ) {
  }
}
