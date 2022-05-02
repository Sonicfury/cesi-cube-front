import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import {SessionState} from "./session-state";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Jwt} from "../models/jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends BaseService<SessionState> {
  private readonly _url = `${AuthenticationService.BASE_API_URL}/authentication_token`;
  private _state: SessionState = SessionState.DISCONNECTED;

  constructor(private _http: HttpClient) {
    super();
  }

  /**
   * Check whether session jwt exists
   * @returns {boolean}
   */
  isAuthenticated(): boolean {
    return !!AuthenticationService.getToken() && AuthenticationService.getToken() !== null;
  }

  /**
   * Attempt to login user and store Jwt jwt in LocalStorage if authenticated
   * @param email
   * @param password
   * @param mode
   * @returns {Observable<HttpResponse<Jwt>>}
   */
  signIn(email: string, password: string): Observable<HttpResponse<Jwt>> {

    AuthenticationService._clearToken(); // always

    const body = {
      email: email,
      password: password
    }

    console.log(body);
    return this._http.post<Jwt>(this._url, body, {observe: 'response', headers: this.headers})
      .pipe(
        map(resp => {
          if (resp.status === 200 && resp.body && resp.body.token) {
            AuthenticationService._storeToken(resp.body.token);
            this._state = SessionState.PENDING;
          }

          return resp;
        })
      );
  }

  /**
   * Disconnect user an clear session information
   */
  signOut(clearLocalStorage?: boolean): void {

    if (clearLocalStorage) {
      localStorage.clear();
    } else {
      AuthenticationService._clearToken();
      AuthenticationService._clearUser();
    }

    this.state = SessionState.DISCONNECTED;
  }

  public static getToken(): string | null {
    return localStorage.getItem(AuthenticationService.TOKEN);
  }

  private static _storeToken(token: string): void {
    localStorage.setItem(AuthenticationService.TOKEN, token);
  }

  private static _clearToken(): void {
    localStorage.removeItem(AuthenticationService.TOKEN);
  }


  private static _clearUser(): void {
    localStorage.removeItem(AuthenticationService.USER);
  }

  get state(): SessionState {
    return this._state;
  }

  set state(value: SessionState) {
    this._state = value;
    this.emit(this._state);
  }
}
