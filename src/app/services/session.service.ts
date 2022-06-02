import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {SessionState} from "./session-state";
import {Observable, of} from "rxjs";
import {User} from "../models/user";
import {Jwt} from "../models/jwt";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SessionService extends BaseService<SessionState> {
  private _currentUser: User;
  private _state: SessionState = SessionState.DISCONNECTED;
  private _jwt: Jwt | null = null;

  constructor(private _router: Router) {
    super();
    this._currentUser = this.getCurrentUserFromLocalStorage();
    const token = localStorage.getItem(SessionService.TOKEN);

    if (token) {
      this._jwt = new Jwt(token);
    }

    if (this._currentUser && this._jwt) {
      this._state = SessionState.CONNECTED
    }
  }

  private getCurrentUserFromLocalStorage(): User {

    return this.readLocalStorage(SessionService.USER) as User;
  }

  logout(): Observable<boolean> {
    this.removeItemFromLocalStorage(SessionService.USER);
    this.removeItemFromLocalStorage(SessionService.TOKEN);
    this._jwt = null;
    this.state = SessionState.DISCONNECTED;

    sessionStorage.clear();

    return of(true);
  }

  destroySession() {
    this._jwt = null;
    sessionStorage.clear();
    this.state = SessionState.DISCONNECTED;
  }

  storeInLocalStorage(key: string, item: object | boolean | string | any) {
    localStorage.setItem(key, JSON.stringify(item));
  }

  storeInSessionStorage(key: string, item: object | boolean | string | any) {
    sessionStorage.setItem(key, JSON.stringify(item));
  }

  readLocalStorage(key: string): any {
    const jsonContent = localStorage.getItem(key);

    return jsonContent && JSON.parse(jsonContent);
  }

  readSessionStorage(key: string): any {
    const jsonContent = sessionStorage.getItem(key);

    return jsonContent && JSON.parse(jsonContent);
  }

  removeItemFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  removeItemFromSessionStorage(key: string) {
    sessionStorage.removeItem(key);
  }

  get currentUser(): User {
    return this._currentUser;
  }

  set currentUser(user: User) {
    this._currentUser = user;
    this.storeInLocalStorage(SessionService.USER, user);
    this.state = SessionState.CONNECTED;
  }

  get jwt(): Jwt | null {
    return this._jwt;
  }

  get state(): SessionState {
    return this._state;
  }

  set state(value: SessionState) {
    this._state = value;
    this.emit(this._state)
  }
}
