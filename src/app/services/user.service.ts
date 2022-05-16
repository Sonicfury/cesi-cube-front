import {Injectable} from '@angular/core';
import {User} from "../models/user";
import {BaseService} from "./base.service";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {SpdrQueryBuilder} from "@sonicfury/spider-query-builder";

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
    const qb = new SpdrQueryBuilder().search('email', [email]);

    return this._http.get<HttpResponse<User>>(`${this._url}?${qb.query}`).pipe(
      map(resp => resp.body as User)
    );
  }

  register(user: User): Observable<User> {

    return this._http.post<User>(this._url, JSON.stringify(user), {observe: 'response', headers: this.headers}).pipe(
      map(resp => resp.body as User)
    )
  }
}
