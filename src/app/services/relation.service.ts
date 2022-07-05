import {Injectable} from '@angular/core'
import {BaseService} from "./base.service"
import {Relation} from "../models/relation"
import {HttpClient} from "@angular/common/http"
import {SessionService} from "./session.service"
import {map, Observable, switchMap, timer} from "rxjs"
import {LaravelResponse} from "../models/laravel-response"
import {User} from "../models/user";
import {SessionState} from "./session-state";

export interface RelationInterface {
  pending: Relation[]
  accepted: Relation[]
}

@Injectable({
  providedIn: 'root'
})
export class RelationService extends BaseService<RelationInterface> {
  private _currentUser!: User
  private _pending: Relation[] = []
  private _accepted: Relation[] = []

  constructor(private _http: HttpClient,
              private _sessionService: SessionService) {
    super();
    this._currentUser = this._sessionService.currentUser
    this._sessionService.watch
    ((state: SessionState) => state === SessionState.CONNECTED && (this._currentUser = this._sessionService.currentUser)
    )

    timer(500, 10000).pipe(
      switchMap(_ => this.get(this._currentUser.id))
    ).subscribe(relations => {
      this._pending = relations.filter(r => (r.secondUser?.id === this._currentUser.id) && !r.isAccepted)
      this._accepted = relations.filter(r => r.isAccepted == true)

      this.emit({pending: this._pending, accepted: this._accepted})
    })
  }

  get(id?: number): Observable<Relation[]> {
    const url = `${RelationService.BASE_API_URL}/users/${id}/relations`

    return this._http.get<LaravelResponse<Relation[]>>(url).pipe(
      map(resp => resp.data as Relation[])
    )
  }

  get pending(): Relation[] {
    return this._pending;
  }

  get accepted(): Relation[] {
    return this._accepted;
  }
}
