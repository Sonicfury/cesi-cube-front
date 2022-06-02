import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {SessionState} from "./session-state";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Jwt} from "../models/jwt";
import {SessionService} from "./session.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends BaseService<any> {
  private readonly _url = `${AuthenticationService.BASE_API_URL}/authentication_token`;

  constructor(private _http: HttpClient, private _sessionService: SessionService) {
    super();
  }

  /**
   * Check whether session jwt exists
   * @returns {boolean}
   */
  isAuthenticated(): boolean {
    return this._sessionService.state === SessionState.CONNECTED;
  }

  /**
   * Attempt to login user and store Jwt jwt in LocalStorage if authenticated
   * @param email
   * @param password
   * @returns {Observable<HttpResponse<Jwt>>}
   */
  signIn(email: string, password: string): Observable<HttpResponse<Jwt>> {

    this._sessionService.removeItemFromLocalStorage(AuthenticationService.TOKEN)

    const body = {
      email: email,
      password: password
    }

    return this._http.post<Jwt>(this._url, body, {observe: 'response', headers: this.headers})
      .pipe(
        map(resp => {
          if (resp.status === 200 && resp.body && resp.body.token) {
            this._sessionService.state = SessionState.PENDING;
            this._sessionService.storeInLocalStorage(AuthenticationService.TOKEN, resp.body.token);
          }

          return resp;
        })
      );
  }

  /**
   * Disconnect user an clear session information
   */
  signOut(): void {
    this._sessionService.destroySession();
  }

  public static getToken(): string | null {
    return localStorage.getItem(AuthenticationService.TOKEN);
  }
}
