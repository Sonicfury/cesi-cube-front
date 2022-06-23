import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {SessionService} from "../services/session.service";
import {Router} from "@angular/router";

@Injectable()
export class TokenizerInterceptor implements HttpInterceptor {

  constructor(private _sessionService: SessionService, private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this._sessionService.jwt) {
      return next.handle(this.tokenize(request))
        .pipe(
          catchError(err => 401 === err.status ? this.logout() : throwError(err))
        )
    }

    return next.handle(request);
  }

  private tokenize(request: HttpRequest<any>) {
    return request.clone({setHeaders: {'Authorization': `Bearer ${this._sessionService.jwt?.token}`}});
  }

  private logout(): Observable<any> {
    return this._sessionService.logout().pipe(
      tap(() => this.router.navigate(['login']))
    );
  }
}
