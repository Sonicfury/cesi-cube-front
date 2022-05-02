export class User {

  constructor(
    private _id: number,
    private _email: string,
    private _roles: string[],
    private _createdAt: Date,
    private _lastUpdatedAt: Date
  ) {
  }

  get id(): number {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get roles(): string[] {
    return this._roles;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get lastUpdatedAt(): Date {
    return this._lastUpdatedAt;
  }
}
