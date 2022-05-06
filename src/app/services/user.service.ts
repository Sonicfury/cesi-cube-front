import {Injectable} from '@angular/core';
import {User} from "../models/user";
import {BaseService} from "./base.service";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {
  private readonly _url = `${UserService.BASE_API_URL}/api/users`;

  constructor(private _http: HttpClient) {
    super()
  }

  search(query: string): Observable<HttpResponse<User[]>> {

    return this._http.get<HttpResponse<User[]>>(`${this._url}/?${query}`).pipe(
      tap(resp => resp.body ?? [])
      // todo implement hydra
    );
  }

  findByEmail(email: string): Observable<User> {

    return this._http.get<HttpResponse<User>>(`${this._url}/${email}`).pipe(
      map(resp => resp.body as User)
    );
  }

  register(email: string, password: string) {
    return this._http.post<User>(this._url, JSON.stringify({email, password}), {observe: 'response', headers: this.headers}).pipe(
      map(resp => resp.body as User)
    )
  }
}
