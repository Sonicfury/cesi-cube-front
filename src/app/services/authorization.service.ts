import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {ACCESS_RIGHTS} from "./access-rights";
import {SessionService} from "./session.service";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService extends BaseService<boolean> {

  constructor(private sessionService: SessionService) {
    super();
  }

  public isRouteGranted(path: string): boolean {
    const currentUser = this.sessionService.currentUser;

    return ACCESS_RIGHTS.find(right => right.path === path)?.roles.some(role => currentUser.roles.includes(role)) ?? false;
  }
}
