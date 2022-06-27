import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {SessionService} from "../../services/session.service";
import {User} from "../../models/user";
import {SessionState} from "../../services/session-state";
import {ResourceService} from "../../services/resource.service";
import {Resource} from "../../models/resource";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {
  currentUser?: User
  resources: Resource[] = []
  isLoadingResources = false

  constructor(private _authorizationService: AuthorizationService,
              private _sessionService: SessionService,
              private _resourceService: ResourceService,
              private _authenticationService: AuthenticationService
  ) {
    super('Accueil', _authorizationService)

    this.currentUser = _sessionService.currentUser
    _sessionService.watch((state: SessionState) => this.currentUser = _sessionService.currentUser)
  }

  ngOnInit(): void {
    this.isLoadingResources = true
    this._resourceService.getAll()
      .subscribe(resources => {
        this.resources = resources;
        this.isLoadingResources = false
      })
  }

}
