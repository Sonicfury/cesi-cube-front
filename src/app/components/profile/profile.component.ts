import {Component, OnInit} from '@angular/core';
import {AuthorizationService} from "../../services/authorization.service";
import {BaseComponent} from "../base-component";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit {

  constructor(private _authorizationService: AuthorizationService) {
    super('profile', _authorizationService)
  }

  ngOnInit(): void {
  }

}
