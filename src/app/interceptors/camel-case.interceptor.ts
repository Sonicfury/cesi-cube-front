import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import {filter, map, Observable} from 'rxjs';
import {camelCase} from "change-case";

@Injectable()
export class CamelCaseInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      filter(event => event instanceof HttpResponse),
      map(event => {
        if (event instanceof HttpResponse && event.body.data) {
          const camel = this.changeResponseCase(event.body)
          console.log(camel)
          event = event.clone({body: camel})
        }
        return event;
      })
    );
  }

  changeResponseCase(object: any): any {
    if (!object) {
      return object
    }

    const entries = Object.entries(object)

    const lol = Object.fromEntries(
      entries.map(([key, value]) => {
        if (typeof value === 'object' || Array.isArray(value)){
          this.changeResponseCase(value)
        }
        return [camelCase(key), value];
      }),
    )

    return lol
  }
}
