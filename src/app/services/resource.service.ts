import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {Resource} from "../models/resource";
import {HttpClient} from "@angular/common/http";
import {map, Observable, pipe, tap} from "rxjs";
import {LaravelResponse, Paginated} from "../models/laravel-response";
import {SessionService} from "./session.service";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class ResourceService extends BaseService<Resource> {
  private readonly _url = `${ResourceService.BASE_API_URL}/resources`
  private readonly CURRENTLY_CREATING = 'current'
  private readonly CURRENTLY_CREATING_MEDIA = 'current-media'
  private _resources: Resource[] = []
  private _lastPage = 1
  private _currentlyCreating: Resource = new Resource();
  private _currentlyCreatingMedia?: string

  constructor(private _http: HttpClient,
              private _authenticationService: AuthenticationService,
              private _sessionService: SessionService) {
    super()
    const localResource = this._sessionService.readSessionStorage(this.CURRENTLY_CREATING)
    if (localResource) this._currentlyCreating = localResource
    const localResourceMedia = this._sessionService.readLocalStorage(this.CURRENTLY_CREATING_MEDIA)
    if (localResourceMedia) this._currentlyCreatingMedia = localResourceMedia
  }

  getAll(page?: number, sort = true): Observable<Resource[]> {
    const baseUrl = this._authenticationService.isAuthenticated() ? this._url : `${ResourceService.BASE_API_URL}/public/resources`
    const url = page ? `${baseUrl}/?page=${page}` : baseUrl

    return this._http.get<LaravelResponse<Paginated<Resource>>>(url).pipe(
      tap(resp => this._lastPage = resp.data.last_page ?? 1 ),
      map(resp => resp.data.data ?? []),
      tap(resources => resources.map(r => !this._resources.some(res => res.id === r.id) && this._resources.push(r))),
      tap(_ => sort && this._sortResources())
    );
  }

  create(): Observable<Resource> {

    return this._http.post<LaravelResponse<Resource>>(this._url, JSON.stringify(this._currentlyCreating), {
      observe: 'response',
      headers: this.headers
    }).pipe(
      tap(resp => resp.status === 200 && (this.currentlyCreating = new Resource()) && this.removeCurrentlyCreatingMedia()),
      map(resp => resp.body?.data as Resource),
    )
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

  get lastPage(): number {
    return this._lastPage;
  }

  get currentlyCreating(): Resource {
    return this._currentlyCreating;
  }

  set currentlyCreating(value: Resource) {
    this._currentlyCreating = value;
    this._sessionService.storeInSessionStorage(this.CURRENTLY_CREATING, this._currentlyCreating)
  }


  get currentlyCreatingMedia(): string {
    return this._currentlyCreatingMedia ?? '';
  }

  set currentlyCreatingMedia(value: string) {
    this._currentlyCreatingMedia = value;
    this._sessionService.storeInLocalStorage(this.CURRENTLY_CREATING_MEDIA, this._currentlyCreatingMedia)
  }

  removeCurrentlyCreatingMedia() {
    delete this._currentlyCreatingMedia
    this._sessionService.removeItemFromLocalStorage(this.CURRENTLY_CREATING_MEDIA)
  }
}