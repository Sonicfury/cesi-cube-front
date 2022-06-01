import {Component, OnInit} from '@angular/core';
import {AuthorizationService} from "../../services/authorization.service";
import {BaseComponent} from "../base-component";
import {SessionService} from "../../services/session.service";
import {User} from "../../models/user";
import {FormBuilder, FormGroup} from "@angular/forms";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit {
  currentUser: User;
  //profileFormGroup: FormGroup;

  constructor(private _authorizationService: AuthorizationService,
              private _sessionService: SessionService,
              private _formBuilder: FormBuilder) {
    super('profile', _authorizationService)
    this.currentUser = this._sessionService.currentUser;
    //this.profileFormGroup = this._formBuilder.group()
  }

  ngOnInit(): void {
  }

}
