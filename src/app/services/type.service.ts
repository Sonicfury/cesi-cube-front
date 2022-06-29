import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {Type} from "../models/type";
import {HttpClient} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {LaravelResponse, Paginated} from "../models/laravel-response";

@Injectable({
  providedIn: 'root'
})
export class TypeService extends BaseService<Type[]>{
  private readonly _url = `${TypeService.BASE_API_URL}/types`
  private _types: Type[] = [];

  constructor(private _http: HttpClient) {
    super();
    this.getAll().subscribe(data => this.emit(data))
  }

  getAll(): Observable<Type[]> {
    return this._http.get<LaravelResponse<Paginated<Type>>>(this._url).pipe(
      map(resp => resp.data.data ?? []),
      tap(types => this._types.push(...types))
    );
  }

  get types(): Type[] {
    return this._types;
  }
}
