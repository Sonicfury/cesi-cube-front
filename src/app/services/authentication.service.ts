import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {SessionState} from "./session-state";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {SessionService} from "./session.service";
import {AuthResponse} from "../models/auth-response";
import {User} from "../models/user";
import {Jwt} from "../models/jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends BaseService<any> {
  private readonly _loginUrl = `${AuthenticationService.BASE_API_URL}/login`;
  private readonly _registerUrl = `${AuthenticationService.BASE_API_URL}/register`;

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
   * @returns {Observable<HttpResponse<AuthResponse>>}
   */
  signIn(email: string, password: string): Observable<HttpResponse<AuthResponse>> {

    this._sessionService.removeItemFromLocalStorage(AuthenticationService.TOKEN)

    const body = {
      email: email,
      password: password
    }

    return this._http.post<AuthResponse>(this._loginUrl, body, {observe: 'response', headers: this.headers})
      .pipe(
        map(resp => {
          if (resp.status === 200 && resp.body && resp.body.data.token) {
            this._sessionService.state = SessionState.PENDING;
            this._sessionService.jwt = new Jwt(resp.body.data.token);
          }

          return resp;
        })
      );
  }

  register(user: User): Observable<HttpResponse<AuthResponse>> {

    return this._http.post<AuthResponse>(this._registerUrl, JSON.stringify(user), {
      observe: 'response',
      headers: this.headers
    }).pipe(
      map(resp => {
        if (resp.status === 200 && resp.body && resp.body.data.token) {
          this._sessionService.state = SessionState.PENDING;
          this._sessionService.storeInLocalStorage(AuthenticationService.TOKEN, resp.body.data.token);
        }

        return resp
      })
    )
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
