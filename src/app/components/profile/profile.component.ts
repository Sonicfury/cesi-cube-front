import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {ActivatedRoute} from "@angular/router";
import {SnackbarService} from "../../services/snackbar.service";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit {
  user!: User

  constructor(private _authorizationService: AuthorizationService,
              private _userService: UserService,
              private _route: ActivatedRoute,
              private _snackbarService: SnackbarService) {
    super('profile', _authorizationService);
  }

  ngOnInit(): void {
    this.loadUser()
  }

  loadUser() {
    const id = this._route.snapshot.paramMap.get('id') as string

    this._userService.get(Number(id))
      .subscribe({
        next: user => this.user = user
      })
  }

}
