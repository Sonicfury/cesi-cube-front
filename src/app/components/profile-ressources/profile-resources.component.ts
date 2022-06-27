import {Component, Input, OnInit} from '@angular/core';
import {tap} from "rxjs";
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {ResourceService} from "../../services/resource.service";


@Component({
  selector: 'app-profile-resources',
  templateUrl: './profile-resources.component.html',
  styleUrls: ['./profile-resources.component.scss']
})
export class ProfileResourcesComponent extends BaseComponent implements OnInit {
  private _user: any
  @Input() set user(value: any) {
    this._user = value

    value && this._resourceService.getAll()
      .subscribe(ressources => this.resources = ressources)
  }

  resources: any = []


  constructor(private _authorizationService: AuthorizationService,
              private _resourceService: ResourceService) {
    super('profile-resources', _authorizationService)
  }


  ngOnInit(): void {
  }

}
