import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {Ressource} from "../models/ressource";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class RessourceService extends BaseService<Ressource>{
  private readonly _url = `${RessourceService.BASE_API_URL}/api/Ressource`;

  constructor(private _http: HttpClient) {
    super()
  }

  search(query: string): Observable<Ressource[]> {

    return this._http.get<HttpResponse<Ressource[]>>(`${this._url}/?${query}`).pipe(
      map(resp => resp.body ?? [])
      // todo implement hydra
    );
  }
}
