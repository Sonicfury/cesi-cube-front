import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {SessionService} from "../services/session.service";
import {tokenize} from "@angular/compiler/src/ml_parser/lexer";
import {Router} from "@angular/router";

@Injectable()
export class TokenizerInterceptor implements HttpInterceptor {

  constructor(private sessionService: SessionService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(this.sessionService.jwt) {
        return next.handle(TokenizerInterceptor.tokenize(request))
          .pipe(
            catchError(err => 401 === err.status ? this.logout() : throwError(err))
          )
    }

    return next.handle(request);
  }

  private static tokenize(request: HttpRequest<any>) {
    return request.clone({setHeaders: {'Authorization': `Bearer ${this.sessionService.jwt.token}`}});
  }

  private logout(): Observable<any> {
    return this.sessionService.logout().pipe(
      tap(() => this.router.navigate(['login']))
    );
}
