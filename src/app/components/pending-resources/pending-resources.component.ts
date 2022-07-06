import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {Resource} from "../../models/resource";
import {ResourceService} from "../../services/resource.service";
import {LaravelQueryBuilder} from "../../helpers/filters.helper";
import {SnackbarService} from "../../services/snackbar.service";
import {ViewportScroller} from "@angular/common";
import {EStatus} from "../../models/status";

@Component({
  selector: 'app-pending-resources',
  templateUrl: './pending-resources.component.html',
  styleUrls: ['./pending-resources.component.scss']
})
export class PendingResourcesComponent extends BaseComponent implements OnInit {
  resources: Resource[] = []
  isLoading = false
  loadingResourcesAccept: Resource[] = []
  loadingResourcesDelete: Resource[] = []
  page = 1
  filter = ''

  constructor(private _authorizationService: AuthorizationService,
              private _resourceService: ResourceService,
              private _viewPortScroller: ViewportScroller,
              private _snackbarService: SnackbarService) {
    super('pending', _authorizationService);
  }

  ngOnInit(): void {
    this.filter = new LaravelQueryBuilder()
      .addFilter('status', '=', 'pending')
      .addSort('updated_at', 'asc')
      .addSort('created_at', 'asc')
      .query

    this.loadResources()
  }

  loadResources() {
    this.isLoading = true

    this._resourceService.get(1, this.filter)
      .subscribe({
        next: resources => (this.resources = resources) && (this.isLoading = false),
        error: _ => this._snackbarService.error('Une erreur est survenue pendant le chargement des ressources')
      })
  }

  onScroll() {
    if (this.page < this._resourceService.lastPage) {
      this.page += 1

      this._resourceService.get(this.page, this.filter)
        .subscribe(resources => {
          this.resources = [...new Set([...this.resources, ...resources])]
        })
    }
  }

  onRefresh(anchor: string) {
    this._viewPortScroller.scrollToAnchor(anchor)
    this.loadResources()
  }

  trackBy(index: number, resource: Resource) {
    return resource.id
  }

  onAccept(resource: Resource) {
    resource.status = EStatus.ACCEPTED

    this.loadingResourcesAccept.push(resource)

    this._resourceService.update(resource).subscribe({
      next: resource => {
        this._snackbarService.success('La ressource a été acceptée avec succès.')
        this.resources = this.resources.filter(r => r.id !== resource.id)
      },
      error: _ => {
        this._snackbarService.error('Une erreur est survenue pendant l\'acceptation de la ressource.')
        this.loadingResourcesAccept = this.loadingResourcesAccept.filter(lra => lra.id !== resource.id)
      }
    })
  }

  onDelete(resource: Resource) {
    this._resourceService.delete(resource.id as number).subscribe({
      next: _ => {
        this._snackbarService.success('La ressource a été rejetée avec succès.')
        this.resources = this.resources.filter(r => r.id !== resource.id)
      },
      error: _ => {
        this._snackbarService.error('Une erreur est survenue pendant la rejection de la ressource.')
        this.loadingResourcesDelete = this.loadingResourcesDelete.filter(lrd => lrd.id !== resource.id)
      }
    })
  }

  isLoadingResourceAccept(resource: Resource): boolean {
    return this.loadingResourcesAccept.some(lra => lra.id === resource.id)
  }

  isLoadingResourceDelete(resource: Resource): boolean {
    return this.loadingResourcesDelete.some(lrd => lrd.id === resource.id)
  }
}
