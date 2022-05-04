import {Component, OnInit} from '@angular/core';
import {tap} from "rxjs";
import {UserService} from "../../services/user.service";
import {AuthorizationService} from "../../services/authorization.service";
import {BaseComponent} from "../base-component";


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent extends BaseComponent implements OnInit {
  users: any = []

  constructor(private _authorizationService: AuthorizationService, private userService: UserService) {
    super('profil', _authorizationService)
  }

  ngOnInit(): void {
    this.userService.search("")
      .pipe(
        tap(users => console.table(users))
      )
      .subscribe(users => this.users = users)


  }

}
