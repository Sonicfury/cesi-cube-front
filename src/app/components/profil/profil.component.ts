import {Component, OnInit} from '@angular/core';
import {tap} from "rxjs";
import {AuthorizationService} from "../../services/authorization.service";
import {BaseComponent} from "../base-component";
import {CitoyenService} from "../../services/citoyen.service";


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent extends BaseComponent implements OnInit {
  citoyens: any = []

  constructor(private _authorizationService: AuthorizationService, private citoyenService: CitoyenService) {
    super('profil', _authorizationService)
  }

  ngOnInit(): void {
    this.citoyenService.search("")
      .pipe(
        tap(citoyens => console.table(citoyens))
      )
      .subscribe(citoyens => this.citoyens = citoyens)


  }

}
