import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {SessionState} from "./session-state";
import {Observable, of} from "rxjs";
import {User} from "../models/user";
import {Jwt} from "../models/jwt";

@Injectable({
  providedIn: 'root'
})
export class SessionService extends BaseService<{ state: SessionState, user?: User }> {
  private _currentUser: User;
  private _jwt: Jwt | null = null;

  constructor() {
    super();
    this._currentUser = this.getCurrentUserFromLocalStorage();
    const token = localStorage.getItem(SessionService.TOKEN);

    if (token) {
      this._jwt = new Jwt(token);
    }
  }

  private getCurrentUserFromLocalStorage(): User {

    return this.readLocalStorage(SessionService.USER) as User;
  }

  logout(): Observable<boolean> {
    this.removeItemFromLocalStorage(SessionService.USER);
    this.removeItemFromLocalStorage(SessionService.TOKEN);
    this._jwt = null;
    this.emit({state: SessionState.DISCONNECTED});

    sessionStorage.clear();

    return of(true);
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
    this.emit({state: SessionState.CONNECTED, user: user});
  }

  get jwt(): Jwt | null {
    return this._jwt;
  }
}
