import {Component, Input, OnInit} from '@angular/core';
import {Resource, SCOPE_LABELS} from "../../models/resource";

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {
  @Input() resource!: Resource
  scopeLabels = SCOPE_LABELS

  constructor() { }

  ngOnInit(): void {
  }

}
