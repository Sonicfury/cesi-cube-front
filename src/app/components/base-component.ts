import {ComponentInterface} from "./component-interface";
import {AuthorizationService} from "../services/authorization.service";

export class BaseComponent implements ComponentInterface {
  title: string;

  constructor(title: string, private authorizationService: AuthorizationService) {
    this.title = title;
  }

  isRouteGranted(path: string): boolean {
    return this.authorizationService.isRouteGranted(path);
  }
}
