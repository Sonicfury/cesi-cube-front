import {Component, Input, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {catchError, filter, map, Observable, switchMap, tap, throwError} from "rxjs";
import {User} from "../../models/user";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {SessionService} from "../../services/session.service";
import {UserService} from "../../services/user.service";
import {SnackbarService} from "../../services/snackbar.service";
import {HttpResponse} from "@angular/common/http";
import {AuthData, LaravelResponse} from "../../models/laravel-response";
import {EditResourceDialogComponent} from "../edit-resource-dialog/edit-resource-dialog.component";
import {Resource} from "../../models/resource";
import {ForgotPasswordComponent} from "../forgot-password/forgot-password.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent extends BaseComponent implements OnInit {
  @Input() user!: User
  loginForm!: FormGroup;
  isLoading = true;

  isEditLoading = false

  constructor(
    private _authorizationService: AuthorizationService,
    private _authenticationService: AuthenticationService,
    private _sessionService: SessionService,
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _snackbarService: SnackbarService,
    private _dialog: MatDialog
  ) {
    super('login-form', _authorizationService);
  }

  ngOnInit(): void {
    this.buildForm();
  }

  onForgotPassword() {
    const dialogRef = this._dialog.open(ForgotPasswordComponent)

    dialogRef.afterClosed().subscribe(value => console.log(value))

    // dialogRef.afterClosed().pipe(
    //   tap(data => data && (this.isEditLoading = false)),
    //   filter((data: Resource) => !!data.id),
    //   switchMap((data: Resource) => this._resourceService.update(data))
    // ).subscribe({
    //   next: resource => {
    //     this.resource = resource
    //     this._snackbarService.success('La ressource a été mise à jour avec succès.')
    //     this.isEditLoading = false
    //   },
    //   error: _ => {
    //     this._snackbarService.error('Une erreur est survenue pendant la mise à jour de la ressource.')
    //     this.isEditLoading = false
    //   }
    // })
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
