import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {catchError, map, Observable, switchMap, throwError} from "rxjs";
import {User} from "../../models/user";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {SessionService} from "../../services/session.service";
import {UserService} from "../../services/user.service";
import {SnackbarService} from "../../services/snackbar.service";
import {HttpResponse} from "@angular/common/http";
import {AuthData, LaravelResponse} from "../../models/laravel-response";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent extends BaseComponent implements OnInit {

  loginForm!: FormGroup;
  isLoading = true;

  constructor(
    private _authorizationService: AuthorizationService,
    private _authenticationService: AuthenticationService,
    private _sessionService: SessionService,
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _snackbarService: SnackbarService
  ) {
    super('login-form', _authorizationService);
  }

  ngOnInit(): void {
    this.buildForm();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const [email, password] = [this.loginForm.get('email')?.value, this.loginForm.get('password')?.value];

      this._authenticate(email, password).subscribe({
        next: (user: User) => {
          this.isLoading = false
          this._router.navigate(['/'])
          this._snackbarService.success(`Bienvenue, ${user.firstname} !`)
        },
        error: (error) => {
          let message = 'Les identifiants sont incorrects, merci de réessayer'
          if (error.status !== 401) {
            message = 'Un problème est survenu pendant la connexion'
          }
          this._snackbarService.error(message) && console.log(error)
          this.isLoading = false
        },
      });
    }
  }

  buildForm() {
    this.loginForm = this._formBuilder.group(
      {
        email: this._formBuilder.control(null, [
          Validators.required,
          Validators.email

        ]),
        password: this._formBuilder.control(null, [
          Validators.required,
          Validators.min(8)
        ])
      }
    )

    this.isLoading = false;
  }

  private _authenticate(email: string, password: string): Observable<User> {

    return this._authenticationService.signIn(email, password)
      .pipe(
        catchError(err => throwError(err)),
        map((user: User) => {
          this._sessionService.currentUser = user;

          return user;
        })
      )
  }
}
