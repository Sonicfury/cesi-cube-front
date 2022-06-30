import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {Category} from "../models/category";
import {map, Observable, tap} from "rxjs";
import {LaravelResponse, Paginated} from "../models/laravel-response";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService<Category[]>{
  private readonly _url = `${CategoryService.BASE_API_URL}/categories`
  private _categories: Category[] = [];

  constructor(private _http: HttpClient) {
    super();
    this.getAll().subscribe(data => this.emit(data))
  }

  getAll(): Observable<Category[]> {
    return this._http.get<LaravelResponse<Category[]>>(this._url).pipe(
      map(resp => resp.data ?? []),
      tap(categories => this._categories.push(...categories))
    );
  }

  get categories(): Category[] {
    return this._categories;
  }
}
