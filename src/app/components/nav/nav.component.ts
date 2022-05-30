import {Component, OnInit} from '@angular/core';
import {SessionService} from "../../services/session.service";
import {environment} from "../../../environments/environment";
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {User} from "../../models/user";
import {SessionState} from "../../services/session-state";

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

  constructor(private _authorizationService: AuthorizationService, private _sessionService: SessionService) {
    super('Navigation', _authorizationService);
    this.sessionService.watch((data: { state: SessionState, user?: User }) => this.isConnected = data.state === SessionState.CONNECTED)
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
