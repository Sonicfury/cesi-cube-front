import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {Resource} from "../models/resource";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {LaravelResponse, Paginated} from "../models/laravel-response";
import {SessionService} from "./session.service";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class ResourceService extends BaseService<Resource> {
  private readonly _url = `${ResourceService.BASE_API_URL}/resources`
  private _resources: Resource[] = []
  private _currentlyCreating: Resource = new Resource();

  constructor(private _http: HttpClient, private _authenticationService: AuthenticationService) {
    super()
  }

  getAll(page?: number, sort = true): Observable<Resource[]> {
    const baseUrl = this._authenticationService.isAuthenticated() ? this._url : `${ResourceService.BASE_API_URL}/public/resources`
    const url = page ? `${baseUrl}?page=${page}` : baseUrl

    return this._http.get<LaravelResponse<Paginated<Resource>>>(url).pipe(
      map(resp => resp.data.data ?? []),
      tap(resources => resources.map(r => !this._resources.some(res => res.id === r.id) && this._resources.push(r))),
      tap(_ => console.log(this._resources)),
      tap(_ => sort && this._sortResources())
    );
  }

  private _sortResources() {
    this._resources.sort((a, b) => {
      // @ts-ignore
      return a.createdAt - b.createdAt
    })
  }

  get resources(): Resource[] {
    return this._resources;
  }

  get currentlyCreating(): Resource {
    return this._currentlyCreating;
  }

  set currentlyCreating(value: Resource) {
    this._currentlyCreating = value;
  }
}
