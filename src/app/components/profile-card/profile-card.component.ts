import {Component, Input, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {User} from "../../models/user";
import {environment} from "../../../environments/environment";
import {SnackbarService} from "../../services/snackbar.service";

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent extends BaseComponent implements OnInit {
  @Input() user!: User
  apiUrl = environment.apiUrl

  constructor(private _authorizationService: AuthorizationService,
              private _snackbarService: SnackbarService) {
    super('profile card', _authorizationService);
  }

  ngOnInit(): void {
  }

  getMediaUrl(url?: any): string {
    return `${this.apiUrl.slice(0, -4)}${url}`
  }
}
