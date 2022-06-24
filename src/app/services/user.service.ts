import {Injectable} from '@angular/core';
import {User} from "../models/user";
import {BaseService} from "./base.service";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {LaravelResponse} from "../models/laravel-response";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {
  private readonly _url = `${UserService.BASE_API_URL}/users`;

  constructor(private _http: HttpClient) {
    super()
  }

  get(id: number): Observable<User> {

    return this._http.get<LaravelResponse<User>>(`${this._url}/${id}`)
      .pipe(
        map(resp => resp.data)
      );
  }

  update(user: User): Observable<User> {

    return this._http.put<User>(this._url, JSON.stringify(user), {observe: 'response', headers: this.headers} ).pipe(
      map(resp => resp.body as User)
    )
  }
}
