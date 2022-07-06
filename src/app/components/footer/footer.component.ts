import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends BaseComponent implements OnInit {
  appName = environment.appName
  appDescription = environment.description

  constructor(private _authorizationService: AuthorizationService) {
    super('footer', _authorizationService);
  }

  ngOnInit(): void {
  }

}
