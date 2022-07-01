import {Injectable} from '@angular/core';
import {User} from "../models/user";
import {BaseService} from "./base.service";
import {HttpClient} from "@angular/common/http";
import {iif, map, Observable, of, tap} from "rxjs";
import {LaravelResponse} from "../models/laravel-response";
import {SessionService} from "./session.service";
import {SessionState} from "./session-state";
import {Resource} from "../models/resource";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {
  private readonly _url = `${UserService.BASE_API_URL}/users`;
  private _currentUser = this._sessionService.currentUser

  constructor(private _http: HttpClient, private _sessionService: SessionService) {
    super()
    _sessionService.watch((state: SessionState) => {
      if (state === SessionState.CONNECTED) {
        this._currentUser = _sessionService.currentUser
      }
    })
  }

  get(id: number): Observable<User> {

    return this._http.get<LaravelResponse<User>>(`${this._url}/${id}`)
      .pipe(
        map(resp => resp.data)
      );
  }

  update(user: User): Observable<User> {

    return this._http.put<LaravelResponse<User>>(`${this._url}/${user.id}`, JSON.stringify(user), {
      observe: 'response',
      headers: this.headers
    }).pipe(
      map(resp => resp.body?.data as User)
    )
  }

  resourceAction(action: string, resource: Resource, userId?: number) {
    let url = ''
    let create = true
    const id = userId ?? this._currentUser.id

    switch (action) {
      case 'bookmark':
        url = `${this._url}/${id}/read_later/${resource.id}`
        create = !resource.readLater.some((item: { id: number }) => item.id === id)
        break
      case 'favorite':
        url = `${this._url}/${id}/favorites/${resource.id}`
        create = !resource.favorites.some((item: { id: number }) => item.id === id)
        break
      case 'thumbUp':
        url = `${this._url}/${id}/exploited/${resource.id}`
        create = !resource.exploited.some((item: { id: number }) => item.id === id)
        break
      default:
        break
    }

    return iif(
      () => create,
      this._http.post<LaravelResponse<any>>(url, null, {observe: 'response', headers: this.headers}),
      this._http.delete<LaravelResponse<any>>(url, {observe: 'response', headers: this.headers})
    ).pipe(
      map(resp => resp.body?.data)
    )
  }
}
