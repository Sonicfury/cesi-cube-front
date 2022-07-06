import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";

@Component({
  selector: 'app-profiles-list',
  templateUrl: './profiles-list.component.html',
  styleUrls: ['./profiles-list.component.scss']
})
export class ProfilesListComponent extends BaseComponent implements OnInit {

  constructor(private _authorizationService: AuthorizationService) {
    super('admin profiles', _authorizationService);
  }

  ngOnInit(): void {
  }

}
