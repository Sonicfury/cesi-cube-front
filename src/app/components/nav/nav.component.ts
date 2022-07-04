import {Component, HostListener, OnInit} from '@angular/core';
import {SessionService} from "../../services/session.service";
import {environment} from "../../../environments/environment";
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {SessionState} from "../../services/session-state";
import {fromEvent, Observable, of} from "rxjs";
import {SnackbarService} from "../../services/snackbar.service";
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SearchDialogComponent} from "../search-dialog/search-dialog.component";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent extends BaseComponent implements OnInit {
  apiUrl = environment.apiUrl
  currentUser = this._sessionService.currentUser
  headerLinkTitle: string = `Accueil - ${environment.appName}`;
  appName: string = environment.appName;
  isConnected: Observable<boolean> = of(false);
  isSidenavOpen: boolean = false;
  isSearchBoxOpen: boolean = false;
  dialogRef!: MatDialogRef<SearchDialogComponent>
  shortcutName: string
  enableShortcut= true

  @HostListener('document:keydown.meta.k')
  openMac() {
    if (navigator.userAgent.includes('Macintosh')) this.openSearchBox()
  }
  @HostListener('document:keydown.ctrl.k')
  open() {
    if (navigator.userAgent.includes('Windows')) this.openSearchBox()
  }

  constructor(private _authorizationService: AuthorizationService,
              private _sessionService: SessionService,
              private _snackbarService: SnackbarService,
              private _dialog: MatDialog,
              private _router: Router) {
    super('Navigation', _authorizationService);
    this.shortcutName = navigator.userAgent.includes('Macintosh') ? 'Cmd + K' : 'Ctrl + K'
    this.enableShortcut = navigator.userAgent.includes('Macintosh') || navigator.userAgent.includes('Windows')
    this.isConnected = of(this._sessionService.state === SessionState.CONNECTED);
    this._sessionService.watch((state: SessionState) => {
      this.isConnected = of(state === SessionState.CONNECTED)
      this.currentUser = _sessionService.currentUser
    })
  }

  ngOnInit(): void {
    // todo : check roles for routes
  }

  logout() {
    this._sessionService.logout().subscribe(_ => {
      this._snackbarService.success('Deconnecté')
      this._router.navigate(['/'])
    });
  }

  get sessionService(): SessionService {
    return this._sessionService;
  }

  openSearchBox(){
    if (this.isSearchBoxOpen) {
      this.dialogRef.close()
      return
    }
    this.dialogRef = this._dialog.open(SearchDialogComponent, {
    })
    this.dialogRef.afterOpened().subscribe(_ => this.isSearchBoxOpen = true)
    this.dialogRef.afterClosed().subscribe(_ => this.isSearchBoxOpen = false)
  }
}
