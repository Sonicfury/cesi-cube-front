import {Injectable} from '@angular/core';
import {User} from "../models/user";
import {BaseService} from "./base.service";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {SpdrQueryBuilder} from "@sonicfury/spider-query-builder";
import {HydraCollectionInterface} from "../models/hydra";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {
  private readonly _url = `${UserService.BASE_API_URL}/api/users`;

  constructor(private _http: HttpClient) {
    super()
  }

  search(query: string): Observable<HydraCollectionInterface<User>> {

    return this._http.get<HydraCollectionInterface<User>>(`${this._url}/?${query}`).pipe(
      map(resp => resp)
    );
  }

  findByEmail(email: string): Observable<User> {
    const qb = new SpdrQueryBuilder().search('email', [email]);

    return this._http.get<HydraCollectionInterface<User>>(`${this._url}?${qb.query}`).pipe(
      map(resp => resp["hydra:member"][0])
    );
  }

  register(user: User): Observable<User> {

    return this._http.post<User>(this._url, JSON.stringify(user), {observe: 'response', headers: this.headers}).pipe(
      map(resp => resp.body as User)
    )
  }
}
