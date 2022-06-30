import {Component, OnInit} from '@angular/core';
import {SessionService} from "../../services/session.service";
import {environment} from "../../../environments/environment";
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {SessionState} from "../../services/session-state";
import {Observable, of} from "rxjs";
import {SnackbarService} from "../../services/snackbar.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent extends BaseComponent implements OnInit {
  headerLinkTitle: string = `Accueil - ${environment.appName}`;
  appName: string = environment.appName;
  isConnected: Observable<boolean> = of(false);
  isSidenavOpen: boolean = false;

  constructor(private _authorizationService: AuthorizationService,
              private _authenticationService: AuthenticationService,
              private _sessionService: SessionService,
              private _snackbarService: SnackbarService,
              private _router: Router) {
    super('Navigation', _authorizationService);
    this.isConnected = of(this._sessionService.state === SessionState.CONNECTED);
    this._sessionService.watch((state: SessionState) => this.isConnected = of(state === SessionState.CONNECTED))
  }

  ngOnInit(): void {
    // todo : check roles for routes
  }

  logout() {
    this._sessionService.logout().subscribe(_ => {
      this._snackbarService.success('Deconnecté')
      this._router.navigate(['/'])
    });
    // todo : snackbar message
  }

  get sessionService(): SessionService {
    return this._sessionService;
  }

  isAuthenticated(): boolean {
    return this._authenticationService.isAuthenticated()
  }
}
