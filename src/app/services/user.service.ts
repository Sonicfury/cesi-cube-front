import {Injectable} from '@angular/core';
import {User} from "../models/user";
import {BaseService} from "./base.service";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {
  private readonly _url = `${UserService.BASE_API_URL}/users`;

  constructor(private _http: HttpClient) {
    super()
  }

  get(id: number): Observable<User> {

    return this._http.get<User>(`${this._url}/${id}`);
  }

  update(user: User): Observable<User> {

    return this._http.put<User>(this._url, JSON.stringify(user), {observe: 'response', headers: this.headers} ).pipe(
      map(resp => resp.body as User)
    )
  }
}
