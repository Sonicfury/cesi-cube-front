import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {ResourceService} from "../../services/resource.service";
import {Resource} from "../../models/resource";
import {SnackbarService} from "../../services/snackbar.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-resource-detail',
  templateUrl: './resource-detail.component.html',
  styleUrls: ['./resource-detail.component.scss']
})
export class ResourceDetailComponent extends BaseComponent implements OnInit {
  resource!: Resource

  constructor(private _authorizationService: AuthorizationService,
              private _resourceService: ResourceService,
              private _route: ActivatedRoute,
              private _snackbarService: SnackbarService) {
    super('resource-detail', _authorizationService);

    this.loadResource()
  }

  ngOnInit(): void {
  }

  loadResource() {
    const id = this._route.snapshot.paramMap.get('id') as string
    this._resourceService.getOne(Number(id))
      .subscribe({
        next: resource => this.resource = resource,
        error: _ => this._snackbarService.error('Une erreur est survenue pendant le chargement de la ressource')
      })
  }
}
