import {Component, OnInit} from '@angular/core';
import {AuthorizationService} from "../../services/authorization.service";
import {BaseComponent} from "../base-component";

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent extends BaseComponent implements OnInit {

  constructor(private _authorizationService: AuthorizationService) {
    super('profile-info', _authorizationService)
  }

  ngOnInit(): void {


  }
}
