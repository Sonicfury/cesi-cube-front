import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {finalize, map, Observable, switchMap} from "rxjs";
import {User} from "../../models/user";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {SessionState} from "../../services/session-state";
import {SessionService} from "../../services/session.service";
import {UserService} from "../../services/user.service";

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
  ) {
    super('login-form', _authorizationService);
  }

  ngOnInit(): void {
    this.buildForm();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      this._authenticate(email, password)
        .pipe(
          finalize(() => this.isLoading = false)
        ).subscribe({
        next: (user: User) => {
          this._router.navigate(['/'])
          this.isLoading = false;
        },
        error: (error) => (this.isLoading = false) && console.log(error)
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
        switchMap(() => this._userService.findByEmail(email)),
        map((user: User) => {
          this._sessionService.currentUser = user;
          this._authenticationService.state = SessionState.CONNECTED;

          return user;
        })
      )
  }
}
