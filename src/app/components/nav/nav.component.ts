import {Component, OnInit} from '@angular/core';
import {SessionService} from "../../services/session.service";
import {environment} from "../../../environments/environment";
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {User} from "../../models/user";
import {SessionState} from "../../services/session-state";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent extends BaseComponent implements OnInit {
  headerLinkTitle: string = `Accueil - ${environment.appName}`;
  appName: string = environment.appName;
  appDescription: string = environment.description;
  isConnected: boolean = false;

  constructor(private _authorizationService: AuthorizationService,
              private _sessionService: SessionService,
              private authenticationService: AuthenticationService) {
    super('Navigation', _authorizationService);
    this.isConnected = this.authenticationService.state === SessionState.CONNECTED;
    this.authenticationService.watch((state: SessionState) => this.isConnected = state === SessionState.CONNECTED)
  }

  ngOnInit(): void {
    // todo : check roles for routes
  }

  logout() {
    this._sessionService.logout();
    // todo : snackbar message
  }

  get sessionService(): SessionService {
    return this._sessionService;
  }
}
