import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {SessionService} from "../../services/session.service";
import {User} from "../../models/user";
import {SessionState} from "../../services/session-state";
import {ResourceService} from "../../services/resource.service";
import {Resource} from "../../models/resource";
import {AuthenticationService} from "../../services/authentication.service";
import {ViewportScroller} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {
  currentUser?: User
  resources: Resource[] = []
  isLoadingResources = false
  page = 1

  constructor(private _authorizationService: AuthorizationService,
              private _sessionService: SessionService,
              private _resourceService: ResourceService,
              private _authenticationService: AuthenticationService,
              private _viewPortScroller: ViewportScroller
  ) {
    super('Accueil', _authorizationService)

    this.currentUser = _sessionService.currentUser

    _sessionService.watch((state: SessionState) => this.currentUser = _sessionService.currentUser)

    _resourceService.onResourceCreate$.subscribe( _ => this.loadResources())
    _resourceService.onResourceDelete$.subscribe(_ =>  this.loadResources())
  }

  ngOnInit(): void {
    this.loadResources()
  }

  loadResources() {
    this.isLoadingResources = true
    this._resourceService.getAll()
      .subscribe((resources: Resource[]) => {
        this.isLoadingResources = false
        this.resources = resources
      })
  }

  onRefresh(anchor: string) {
    this._viewPortScroller.scrollToAnchor(anchor)
    this.loadResources()
  }

  onScroll() {
    if (this.page < this._resourceService.lastPage) {
      this.page += 1
      this._resourceService.getAll(this.page)
        .subscribe(resources => {
          this.resources = [...new Set([...this.resources, ...resources])]
        })
    }
  }

  isAuthenticated(): boolean {
    return this._authenticationService.isAuthenticated()
  }

  trackBy(index: number, resource: Resource){
    return resource.id
  }
}
