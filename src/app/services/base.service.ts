import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpHeaders} from "@angular/common/http";
import {Subject, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BaseService<T> {
  static readonly TOKEN = 'token';
  static readonly USER = 'user';
  static readonly BASE_API_URL = environment.apiUrl;

  protected headers: HttpHeaders;
  protected _subject: Subject<T>;

  protected constructor() {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    this._subject = new Subject<T>();
  }

  /**
   * Attach an Observer to the Subject in order to be notified.
   * @param callback
   */
  watch(callback: any): Subscription {
    return this._subject.subscribe(callback);
  }

  /**
   * Multicasting to referenced Observers through Subject
   * @param obj
   */
  emit(obj: T): void {
    this._subject.next(obj);
  }

  /**
   * Unsubscribe a single Observer
   * @param sub
   */
  unwatch(sub: Subscription): void {
    sub.unsubscribe();
  }
}
