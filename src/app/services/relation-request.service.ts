import {Injectable} from '@angular/core'
import {BaseService} from "./base.service"
import {RelationRequest} from "../models/relation-request"
import {HttpClient} from "@angular/common/http"
import {SessionService} from "./session.service"
import {map, Observable} from "rxjs"
import {LaravelResponse} from "../models/laravel-response"

@Injectable({
  providedIn: 'root'
})
export class RelationRequestService extends BaseService<RelationRequest> {
  constructor(private _http: HttpClient,
              private _sessionService: SessionService) {
    super();
  }

  get(id?: number): Observable<RelationRequest[]> {
    const url = `${RelationRequestService.BASE_API_URL}/users/${id}/relation_requests`

    return this._http.get<LaravelResponse<RelationRequest[]>>(url).pipe(
      map(resp => resp.data as RelationRequest[])
    )
  }
}
