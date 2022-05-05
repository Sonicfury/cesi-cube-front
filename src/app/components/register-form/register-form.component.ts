import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {SessionService} from "../../services/session.service";
import {UserService} from "../../services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthorizationService} from "../../services/authorization.service";

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
    private _sessionService: SessionService,
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _router: Router,
  ) {
    super('register-form', _authorizationService)
  }

  ngOnInit(): void {
    this.buildForm();
  }

  onSubmit() {
    if (this.nameFormGroup.valid && this.contactFormGroup.valid && this.credentialsFormGroup.valid) {
      this.isLoading = true;
      console.log(this.nameFormGroup, this.credentialsFormGroup, this.contactFormGroup)
      const [
        firstname,
        lastname,
        address1,
        address2,
        zipCode,
        city,
        primaryPhone,
        secondaryPhone,
        birthdate,
        email,
        password
      ] = [
        this.nameFormGroup.get('firstname')?.value,
        this.nameFormGroup.get('lastname')?.value,
        this.nameFormGroup.get('birthdate')?.value,
        this.contactFormGroup.get('address1')?.value,
        this.contactFormGroup.get('address2')?.value,
        this.contactFormGroup.get('zipCode')?.value,
        this.contactFormGroup.get('city')?.value,
        this.contactFormGroup.get('primaryPhone')?.value,
        this.contactFormGroup.get('secondaryPhone')?.value,
        this.credentialsFormGroup.get('email')?.value,
        this.credentialsFormGroup.get('password')?.value,
      ]
    }
  }

  buildForm() {
    const stringPattern = '^([a-zA-Z])+$'
    const phonePattern = '^(?:0|\\(?\\+33\\)?\\s?|0033\\s?)[1-79](?:[\\.\\-\\s]?\\d\\d){4}$\n'

    this.nameFormGroup = this._formBuilder.group(
      {
        firstname: this._formBuilder.control(null, [
          Validators.required,
          Validators.pattern(stringPattern)
        ]),

        lastname: this._formBuilder.control(null, [
          Validators.required,
          Validators.pattern(stringPattern)
        ]),

        birthdate: this._formBuilder.control(null, [
          Validators.required
        ]),
      }
    )
    this.contactFormGroup = this._formBuilder.group(
      {
        address1: this._formBuilder.control(null, [
          Validators.required,
        ]),

        address2: this._formBuilder.control(null, [
        ]),

        zipCode: this._formBuilder.control(null, [
          Validators.required,
        ]),

        city: this._formBuilder.control(null, [
          Validators.required,
          Validators.pattern(stringPattern)
        ]),

        primaryPhone: this._formBuilder.control(null, [
          Validators.required,
          Validators.pattern(phonePattern)
        ]),

        secondaryPhone: this._formBuilder.control(null, [
          Validators.pattern(phonePattern)
        ]),
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
        ])
      }
    )

    this.isLoading = false;
  }

}
