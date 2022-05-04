import {Component, Input, OnInit} from '@angular/core';
import {tap} from "rxjs";
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {RessourceService} from "../../services/ressource.service";


@Component({
  selector: 'app-profil-ressources',
  templateUrl: './profil-ressources.component.html',
  styleUrls: ['./profil-ressources.component.scss']
})
export class ProfilRessourcesComponent extends BaseComponent implements OnInit {
  private _user: any
  @Input() set user(value: any) {
    this._user = value

    value && this.ressourceService.search(this._user.id)
      .pipe(
        tap(ressources => console.table(ressources))
      )
      .subscribe(ressources => this.ressources = ressources)
  }
  ressources: any = []
  constructor(private _authorizationService: AuthorizationService, private ressourceService: RessourceService) {
    super('profil-ressources', _authorizationService)
  }


  ngOnInit(): void {
  }

}
