import {Component, Input, OnInit} from '@angular/core';
import {AuthorizationService} from "../../services/authorization.service";
import {UserService} from "../../services/user.service";
import {BaseComponent} from "../base-component";

@Component({
  selector: 'app-profil-info',
  templateUrl: './profil-info.component.html',
  styleUrls: ['./profil-info.component.scss']
})
export class ProfilInfoComponent extends BaseComponent implements OnInit {
  @Input() user: any

  constructor(private _authorizationService: AuthorizationService, private userService: UserService) {
    super('profil-info', _authorizationService)
  }

  ngOnInit(): void {


  }
}
