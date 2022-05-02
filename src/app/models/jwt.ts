export class Jwt {
  constructor(private _token: string) {
  }

  get token(): string {
    return this._token;
  }
}
