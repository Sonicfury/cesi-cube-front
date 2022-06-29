import {Component, Input, OnInit} from '@angular/core';
import {Resource, SCOPE_LABELS} from "../../models/resource";
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent extends BaseComponent implements OnInit {
  @Input() resource!: Resource
  scopeLabels = SCOPE_LABELS


  constructor(private _authorizationService: AuthorizationService) {
    super('resource', _authorizationService);
  }

  ngOnInit(): void {
  }

}
