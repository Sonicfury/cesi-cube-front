import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent extends BaseComponent implements OnInit {

  constructor(private _authorizationService: AuthorizationService) {
    super('statistics', _authorizationService);
  }

  ngOnInit(): void {
  }

}
