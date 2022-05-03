import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {tap} from "rxjs";
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";


@Component({
  selector: 'app-profil-ressources',
  templateUrl: './profil-ressources.component.html',
  styleUrls: ['./profil-ressources.component.scss']
})
export class ProfilRessourcesComponent extends BaseComponent implements OnInit {
  private _user: any
  @Input() set user(value: any) {
    this._user = value

    value && this.userService.searchPostJPH(this._user.id)
      .pipe(
        tap(ressources => console.table(ressources))
      )
      .subscribe(ressources => this.ressources = ressources)
  }
  ressources: any = []
  constructor(private _authorizationService: AuthorizationService, private userService: UserService) {
    super('profil-ressources', _authorizationService)
  }


  ngOnInit(): void {
  }

}
