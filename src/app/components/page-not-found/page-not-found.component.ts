import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent extends BaseComponent implements OnInit {

  constructor(private _authorizationService: AuthorizationService
  ) {
    super('Page not found', _authorizationService);
  }

  ngOnInit(): void {
  }

}
