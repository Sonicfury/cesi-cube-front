import {Injectable} from '@angular/core'
import {BaseService} from "./base.service"
import {Relation} from "../models/relation"
import {HttpClient} from "@angular/common/http"
import {SessionService} from "./session.service"
import {filter, map, Observable, Subject, Subscription, switchMap, timer} from "rxjs"
import {LaravelResponse} from "../models/laravel-response"
import {User} from "../models/user";
import {SessionState} from "./session-state";
import {RelationType} from "../models/relation-type";

export interface RelationInterface {
  pending: Relation[]
  accepted: Relation[]
}

@Injectable({
  providedIn: 'root'
})
export class RelationService extends BaseService<RelationInterface> {
  private _currentUser!: User
  private _relationTypes: RelationType[] = []
  private _relationTypes$ = new Subject<RelationType[]>()
  private _pending: Relation[] = []
  private _accepted: Relation[] = []
  private _timer$!: Subscription

  constructor(private _http: HttpClient,
              private _sessionService: SessionService) {
    super();
    this._currentUser = this._sessionService.currentUser
    this._sessionService.watch((state: SessionState) => {
        if (state === SessionState.CONNECTED) this._currentUser = this._sessionService.currentUser
      }
    )

    this._timer$ = timer(500, 15000).pipe(
      filter(_ => !!this._currentUser),
      switchMap(_ => this.get(this._currentUser.id))
    ).subscribe(relations => {
      this._pending = relations.filter(r => !r.isAccepted)
      this._accepted = relations.filter(r => r.isAccepted == true)

      this.emit({pending: this._pending, accepted: this._accepted})
    })

    this.getTypes().subscribe(types => {
      this._relationTypes = types
      this._relationTypes$.next(types)
    })
  }

  getTypes(): Observable<RelationType[]> {
    const url = `${RelationService.BASE_API_URL}/relation_types`

    return this._http.get<LaravelResponse<RelationType[]>>(url).pipe(
      map(resp => resp.data as RelationType[])
    )
  }

  get(id?: number): Observable<Relation[]> {
    const url = `${RelationService.BASE_API_URL}/users/${id}/relations`

    return this._http.get<LaravelResponse<Relation[]>>(url).pipe(
      map(resp => resp.data as Relation[])
    )
  }

  accept(relation: Relation): Observable<Relation> {
    const url = `${RelationService.BASE_API_URL}/users/${this._currentUser.id}/relations/${relation.id}`
    relation.isAccepted = 1

    return this._http.put<LaravelResponse<Relation>>(url, JSON.stringify(relation), {
      headers: this.headers,
      observe: 'response'
    }).pipe(
      map(resp => resp.body?.data as Relation)
    )
  }

  create(relation: Relation): Observable<Relation> {
    const url = `${RelationService.BASE_API_URL}/users/${this._currentUser.id}/relations`

    return this._http.post<LaravelResponse<Relation>>(url, JSON.stringify(relation), {
      headers: this.headers,
      observe: 'response'
    }).pipe(
      map(resp => resp.body?.data as Relation)
    )
  }

  delete(relation: Relation): Observable<any> {
    const url = `${RelationService.BASE_API_URL}/users/${this._currentUser.id}/relations/${relation.id}`

    return this._http.delete(url)
  }

  get pending(): Relation[] {
    return this._pending;
  }

  get accepted(): Relation[] {
    return this._accepted;
  }

  get relationTypes(): RelationType[] {
    return this._relationTypes;
  }

  get relationTypes$(): Subject<RelationType[]> {
    return this._relationTypes$;
  }
}
