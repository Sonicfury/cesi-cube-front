import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {SnackbarService} from "../../services/snackbar.service";
import {UserService} from "../../services/user.service";
import {Resource} from "../../models/resource";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-saved-resources',
  templateUrl: './saved-resources.component.html',
  styleUrls: ['./saved-resources.component.scss']
})
export class SavedResourcesComponent extends BaseComponent implements OnInit, OnDestroy {
  resources: Resource[] = []
  isLoading = false
  titleMap = new Map<string, string>([
    ['read_later', 'à lire plus tard'],
    ['exploited', 'exploitées'],
    ['favorites', 'favorites']
  ])
  type = ''
  displayTitle = ''
  nav$!: Subscription

  constructor(private _authorizationService: AuthorizationService,
              private _route: ActivatedRoute,
              private _router: Router,
              private _userService: UserService,
              private _snackbarService: SnackbarService) {
    super('saved', _authorizationService);

    this.nav$ = this._router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit(): void {
    this.type = this._route.snapshot.paramMap.get('type') as string
    this.displayTitle = this.titleMap.get(this.type) as string

    this.loadResources()
  }

  ngOnDestroy() {
    this.nav$.unsubscribe()
  }

  loadResources() {
    this.isLoading = true

    this._userService.getSaved(this.type)
      .subscribe({
        next: resources => (this.resources = resources) && (this.isLoading = false),
        error: _ => this._snackbarService.error('Une erreur est survenue pendant le chargement des ressources')
      })
  }

  trackBy(index: number, resource: Resource) {
    return resource.id
  }
}
