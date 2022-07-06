import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {ACCESS_RIGHTS} from "./access-rights";
import {SessionService} from "./session.service";
import {ERole} from "../models/role";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService extends BaseService<boolean> {

  constructor(private _sessionService: SessionService) {
    super();
  }

  public isRouteGranted(path: string): boolean {
    const currentUser = this._sessionService.currentUser;

    if (!currentUser) {
      return ACCESS_RIGHTS.get(ERole.GUEST)?.includes(path) ?? false
    }

    console.log(path, currentUser.roles.some(
      role => ACCESS_RIGHTS.get(role.name as ERole)?.includes(path) ?? false
    ) )
    return currentUser.roles.some(
      role => ACCESS_RIGHTS.get(role.name as ERole)?.includes(path) ?? false
    )
  }
}
