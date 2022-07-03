import { Component, OnInit } from '@angular/core';
import algoliasearch from "algoliasearch";
import {environment} from "../../../environments/environment";

const searchClient = algoliasearch(
  environment.algolia.appId,
  environment.algolia.publicKey
);

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {
  config = {
    indexName: 'resources_index',
    searchClient
  };

  constructor() { }

  ngOnInit(): void {
  }

}
