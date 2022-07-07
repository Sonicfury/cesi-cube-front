import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {Resource} from "../models/resource";
import {HttpClient} from "@angular/common/http";
import {map, Observable, pipe, Subject, switchMap, tap} from "rxjs";
import {LaravelResponse, Paginated} from "../models/laravel-response";
import {SessionService} from "./session.service";
import {AuthenticationService} from "./authentication.service";
import {Comment} from "../models/comment";

@Injectable({
  providedIn: 'root'
})
export class ResourceService extends BaseService<Resource[]> {
  private readonly _url = `${ResourceService.BASE_API_URL}/resources`
  private readonly CURRENTLY_CREATING = 'current'
  private readonly CURRENTLY_CREATING_MEDIA = 'current-media'
  private _resources: Resource[] = []
  private _lastPage = 1
  private _currentlyCreating: Resource = new Resource();
  private _currentlyCreatingMedia?: string

  public onResourceCreate$: Subject<Resource> = new Subject<Resource>()
  public onResourceDelete$: Subject<number> = new Subject<number>()

  constructor(private _http: HttpClient,
              private _authenticationService: AuthenticationService,
              private _sessionService: SessionService) {
    super()
    const localResource = this._sessionService.readSessionStorage(this.CURRENTLY_CREATING)
    if (localResource) this._currentlyCreating = localResource
    const localResourceMedia = this._sessionService.readLocalStorage(this.CURRENTLY_CREATING_MEDIA)
    if (localResourceMedia) this._currentlyCreatingMedia = localResourceMedia
  }

  get(page?: number, query?: string): Observable<Resource[]> {
    const baseUrl = this._authenticationService.isAuthenticated() ? this._url : `${ResourceService.BASE_API_URL}/public/resources`
    let url = page ? `${baseUrl}/?page=${page}` : baseUrl
    url = !query ? url : `${url}&${query}`

    return this._http.get<LaravelResponse<Paginated<Resource>>>(url).pipe(
      tap(resp => this._lastPage = resp.data.last_page ?? 1),
      map(resp => resp.data.data ?? [] as Resource[]),
    );
  }

  getOne(id: number): Observable<Resource> {

    return this._http.get<LaravelResponse<Resource>>(`${this._url}/${id}`).pipe(
      map(resp => resp.data as Resource),
    );
  }

  create(): Observable<Resource> {

    if (this.currentlyCreatingMedia) {
      this.currentlyCreating = {...this._currentlyCreating, mediaUrl: this.currentlyCreatingMedia.split('base64,')[1]}
    }

    return this._http.post<LaravelResponse<Resource>>(this._url, JSON.stringify(this._currentlyCreating), {
      observe: 'response',
      headers: this.headers
    }).pipe(
      tap(resp => {
        if (resp.status === 200) {
          this.currentlyCreating = new Resource()
          this.removeCurrentlyCreatingMedia()
        }
      }),
      map(resp => resp.body?.data as Resource),
      tap(resource => this.onResourceCreate$.next(resource))
    )
  }

  update(resource: Resource) {
    console.log(resource)
    return this._http.put<LaravelResponse<Resource>>(`${this._url}/${resource.id}`, JSON.stringify(resource), {
      observe: 'response',
      headers: this.headers
    }).pipe(
      map(resp => resp.body?.data as Resource),
    )
  }

  delete(id: number) {

    return this._http.delete<LaravelResponse<Resource>>(`${this._url}/${id}`)
      .pipe(
        tap(_ => this.onResourceDelete$.next(id)),
      );
  }

  comment(id: number, comment: string): Observable<Resource> {
    const body = {content: comment, "user_id": this._sessionService.currentUser.id, "resource_id": id}
    const url = `${this._url}/${id}/comments`

    return this._http.post<LaravelResponse<Comment>>(url, JSON.stringify(body), {
      observe: 'response',
      headers: this.headers
    }).pipe(
      switchMap(_ => this.getOne(id))
    )
  }

  deleteComment(resourceId: number, commentId: number): Observable<Resource> {
    const url = `${this._url}/${resourceId}/comments/${commentId}`

    return this._http.delete<LaravelResponse<Resource>>(url, {
      observe: 'response',
      headers: this.headers
    }).pipe(
      map(resp => resp.body?.data as Resource)
    )
  }

  updateComment(resourceId: number, comment: Comment): Observable<Resource> {
    const url = `${this._url}/${resourceId}/comments/${comment.id}`
    const body = {content: comment.content, "user_id": comment.author?.id, "resource_id": resourceId}

    return this._http.put<LaravelResponse<Resource>>(url, JSON.stringify(comment), {
      observe: 'response',
      headers: this.headers
    }).pipe(
      map(resp => resp.body?.data as Resource)
    )
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
