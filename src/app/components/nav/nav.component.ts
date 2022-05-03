import {Component, OnInit} from '@angular/core';
import {SessionService} from "../../services/session.service";
import {environment} from "../../../environments/environment";
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent extends BaseComponent implements OnInit {

  headerLinkTitle: string = `Accueil - ${environment.appName}`;
  appName: string = environment.appName;
  appDescription: string = environment.description;

  constructor(private _authorizationService: AuthorizationService, private _sessionService: SessionService) {
    super('Navigation', _authorizationService);
  }

  ngOnInit(): void {
    // todo : check roles for routes
  }

  logout() {
    this._sessionService.logout();
  }

}
