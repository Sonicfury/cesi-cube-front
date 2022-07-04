import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from "./authentication.service";
import {AuthorizationService} from "./authorization.service";

@Injectable({
  providedIn: 'root'
})
export class CanActivateApp implements CanActivate {
  constructor(private _authenticationService: AuthenticationService, private _authorizationService: AuthorizationService, private _router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    try {
      if (!this._authenticationService.isAuthenticated()) {

        return this._router.parseUrl('/login')
      }

      return this._authorizationService.isRouteGranted(route.routeConfig?.path as string)
    } catch (e) {

      return false
    }
  }
}
