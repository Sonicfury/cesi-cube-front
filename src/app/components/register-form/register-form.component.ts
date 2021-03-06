import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {SessionService} from "../../services/session.service";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {AuthorizationService} from "../../services/authorization.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError, tap, throwError} from "rxjs";
import {User} from "../../models/user";
import {AuthenticationService} from "../../services/authentication.service";
import {mustMatch} from "../../directives/must-match.directive";
import {SnackbarService} from "../../services/snackbar.service";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent extends BaseComponent implements OnInit {

  nameFormGroup!: FormGroup;
  contactFormGroup!: FormGroup;
  credentialsFormGroup!: FormGroup;
  isLoading = true;

  firstnameFormControl = new FormControl(null, [Validators.required])
  lastnameFormControl = new FormControl(null, [Validators.required])
  birthdateFormControl = new FormControl(null, [Validators.required])

  address1FormControl = new FormControl(null, [Validators.required])
  address2FormControl = new FormControl('', [])
  zipCodeFormControl = new FormControl(null, [Validators.required])
  cityFormControl = new FormControl(null, [Validators.required])
  primaryPhoneFormControl = new FormControl(null, [
    Validators.required,
    Validators.pattern("^[0-9]*$"),
    Validators.minLength(10),
    Validators.maxLength(12)
  ])
  secondaryPhoneFormControl = new FormControl('', [
    Validators.pattern("^[0-9]*$"),
    Validators.minLength(10),
    Validators.maxLength(12)
  ])

  emailFormControl = new FormControl(null, [Validators.required, Validators.email])
  passwordFormControl = new FormControl(null, [Validators.required, Validators.minLength(8)])
  passwordConfirmFormControl = new FormControl(null, [Validators.required, mustMatch(this.passwordFormControl)])

  constructor(
    private _authorizationService: AuthorizationService,
    private _authenticationService: AuthenticationService,
    private _sessionService: SessionService,
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _snackbarService: SnackbarService
  ) {
    super('register-form', _authorizationService)
  }

  ngOnInit(): void {
    this.buildForm();
  }

  onSubmit() {
    if (this.nameFormGroup.valid && this.contactFormGroup.valid && this.credentialsFormGroup.valid) {
      this.isLoading = true;

      const user = new User()

      user.email = this.emailFormControl.value
      user.password = this.passwordFormControl.value
      user.lastname = this.lastnameFormControl.value
      user.firstname = this.firstnameFormControl.value
      user.address1 = this.address1FormControl.value
      user.zipCode = this.zipCodeFormControl.value
      user.city = this.cityFormControl.value
      user.primaryPhone = this.primaryPhoneFormControl.value
      user.secondaryPhone = this.secondaryPhoneFormControl.value
      user.address2 = this.address2FormControl.value
      user.birthDate = this.birthdateFormControl.value

      this._authenticationService.register(user)
        .pipe(
          catchError(err => throwError(err)),
          tap(user => this._sessionService.currentUser = user)
        )
        .subscribe({
            next: user => {
              this._snackbarService.success(`Bienvenue, ${user.firstname} !`)
              this._router.navigate(["/home"])
              this.isLoading = false
            },
            error: _ => {
              this._snackbarService.error('Un probl??me est survenu pendant la cr??ation du compte, veuillez r??essayer')
              this.isLoading = false
            },
          }
        )
    }
  }

  buildForm() {
    this.nameFormGroup = new FormGroup(
      {
        firstname: this.firstnameFormControl,
        lastname: this.lastnameFormControl,
        birthdate: this.birthdateFormControl,
      }
    )
    this.contactFormGroup = new FormGroup(
      {
        address1: this.address1FormControl,
        address2: this.address2FormControl,
        zipCode: this.zipCodeFormControl,
        city: this.cityFormControl,
        primaryPhone: this.primaryPhoneFormControl,
        secondaryPhone: this.secondaryPhoneFormControl,
      }
    )
    this.credentialsFormGroup = new FormGroup({
      email: this.emailFormControl,
      password: this.passwordFormControl,
      passwordConfirm: this.passwordConfirmFormControl
    })

    this.isLoading = false;
  }
}

