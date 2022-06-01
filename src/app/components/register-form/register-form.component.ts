import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {SessionService} from "../../services/session.service";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {AuthorizationService} from "../../services/authorization.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {tap} from "rxjs";
import {User} from "../../models/user";
import {AuthenticationService} from "../../services/authentication.service";
import {SessionState} from "../../services/session-state";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent extends BaseComponent implements OnInit {

  nameFormGroup!: FormGroup;
  contactFormGroup!: FormGroup;
  credentialsFormGroup!: FormGroup;
  isLoading = true

  constructor(
    private _authorizationService: AuthorizationService,
    private _authenticationService: AuthenticationService,
    private _sessionService: SessionService,
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {
    super('register-form', _authorizationService)
  }

  ngOnInit(): void {
    this.buildForm();
  }

  onSubmit() {
    if (this.nameFormGroup.valid && this.contactFormGroup.valid && this.credentialsFormGroup.valid) {
      this.isLoading = true;

      const firstname = this.nameFormGroup.get('firstname')?.value
      const lastname = this.nameFormGroup.get('lastname')?.value
      const address1 = this.nameFormGroup.get('address1')?.value
      const birthdate = this.nameFormGroup.get('birthdate')?.value
      const address2 = this.contactFormGroup.get('address2')?.value
      const zipCode = this.contactFormGroup.get('zipCode')?.value
      const city = this.contactFormGroup.get('city')?.value
      const primaryPhone = this.contactFormGroup.get('primaryPhone')?.value
      const secondaryPhone = this.contactFormGroup.get('secondaryPhone')?.value
      const email = this.credentialsFormGroup.get('email')?.value
      const password = this.credentialsFormGroup.get('password')?.value
      const passwordConfirm = this.credentialsFormGroup.get('passwordConfirm')?.value

      const user = new User(
        email,
        password,
        lastname,
        firstname,
        address1,
        zipCode,
        city,
        primaryPhone,
        secondaryPhone ?? '',
        address2 ?? '',
        birthdate ?? ''
      )

      this._userService.register(user)
        .pipe(
          tap(user => console.log(user)),
          tap(user => this._authenticationService.signIn(user.email, user.password)),
          tap(user => this._sessionService.currentUser = user),
          tap(user => this._authenticationService.state = SessionState.CONNECTED)
        )
        .subscribe(_ => this._router.navigate(["/profil"]))
    }
  }

  buildForm() {
    const stringPattern = '^([a-zA-Z])+$'
    const phonePattern = '^(?:0|\\(?\\+33\\)?\\s?|0033\\s?)[1-79](?:[\\.\\-\\s]?\\d\\d){4}$\n'

    this.nameFormGroup = this._formBuilder.group(
      {
        firstname: this._formBuilder.control(null, [
          Validators.required
        ]),
        lastname: this._formBuilder.control(null, [
          Validators.required
        ]),
        birthdate: this._formBuilder.control(null, [
          Validators.required
        ]),
      }
    )
    this.contactFormGroup = this._formBuilder.group(
      {
        address1: this._formBuilder.control(null, [
          Validators.required
        ]),
        address2: this._formBuilder.control(null, []),
        zipCode: this._formBuilder.control(null, [
          Validators.required
        ]),
        city: this._formBuilder.control(null, [
          Validators.required
        ]),
        primaryPhone: this._formBuilder.control(null, [
          Validators.required
        ]),
        secondaryPhone: this._formBuilder.control(null, []),
      }
    )

    this.credentialsFormGroup = this._formBuilder.group(
      {
        email: this._formBuilder.control(null, [
          Validators.required,
          Validators.email
        ]),
        password: this._formBuilder.control(null, [
          Validators.required,
          Validators.min(8)
        ]),
        passwordConfirm: this._formBuilder.control(null, [
          Validators.required,
          Validators.min(8)
        ])
      },
      this.mustMatch('password', 'passwordConfirm')
    )

    this.isLoading = false;
  }


  mustMatch(controlPassword: string, matchingPasswordConfirm: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlPassword];
      const matchingControl = formGroup.controls[matchingPasswordConfirm];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({mustMatch: true});
      } else {
        matchingControl.setErrors(null);
      }
      return null;
    };
  }

}
