import {Component, OnInit} from '@angular/core';
import {Resource, SCOPE_LABELS} from "../../models/resource";
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {ResourceService} from "../../services/resource.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-resource',
  templateUrl: './create-resource.component.html',
  styleUrls: ['./create-resource.component.scss']
})
export class CreateResourceComponent extends BaseComponent implements OnInit {
  scopeLabels = Array.from(SCOPE_LABELS)
  resource = this._resourceService.currentlyCreating
  resourceFormGroup: FormGroup

  titleFormControl = new FormControl(null, [Validators.required])
  richTextContentFormControl = new FormControl(null, [Validators.required])
  scopeFormControl = new FormControl(null, [Validators.required])
  typeFormControl = new FormControl(null, [Validators.required])
  categoryFormControl = new FormControl(null, [Validators.required])

  media!: File

  constructor(private _authorizationService: AuthorizationService, private _resourceService: ResourceService) {
    super('create-resource', _authorizationService);
    this.resourceFormGroup = new FormGroup({
      title: this.titleFormControl,
      richTextContent: this.richTextContentFormControl,
      scope: this.scopeFormControl,
      type: this.typeFormControl,
      category: this.categoryFormControl
    })
  }

  ngOnInit(): void {
  }

}
