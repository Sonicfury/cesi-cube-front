import {Component, Inject, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {User} from "../../models/user";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends BaseComponent implements OnInit {

  userFormControl = new FormControl(null, [Validators.email])

  constructor(private _authorizationService: AuthorizationService) {
    super('forgot-password', _authorizationService);
  }

  ngOnInit(): void {

  }
}
