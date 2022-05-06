import {Injectable} from '@angular/core';
import {User} from "../models/user";
import {BaseService} from "./base.service";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {Citoyen, CitoyenInterface} from "../models/citoyen";

@Injectable({
  providedIn: 'root'
})
export class CitoyenService extends BaseService<User> {
  private readonly _url = `${CitoyenService.BASE_API_URL}/api/citoyens`;

  constructor(private _http: HttpClient) {
    super()
  }

  search(query: string): Observable<HttpResponse<Citoyen[]>> {

    return this._http.get<HttpResponse<Citoyen[]>>(`${this._url}/?${query}`).pipe(
      tap(resp => resp.body ?? [])
      // todo implement hydra
    );
  }

  register(citoyen: CitoyenInterface, userId: number) {
    const url = `${CitoyenService.BASE_API_URL}/api/users/${userId}/citoyen`
    return this._http.post<HttpResponse<Citoyen>>(url, JSON.stringify(citoyen)).pipe(
      map(resp => resp.body as Citoyen)
    )
  }

}
