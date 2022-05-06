import {Component, Input, OnInit} from '@angular/core';
import {AuthorizationService} from "../../services/authorization.service";
import {BaseComponent} from "../base-component";
import {CitoyenService} from "../../services/citoyen.service";

@Component({
  selector: 'app-profil-info',
  templateUrl: './profil-info.component.html',
  styleUrls: ['./profil-info.component.scss']
})
export class ProfilInfoComponent extends BaseComponent implements OnInit {
  @Input() citoyen: any

  constructor(private _authorizationService: AuthorizationService, private citoyenService: CitoyenService) {
    super('profil-info', _authorizationService)
  }

  ngOnInit(): void {


  }
}
