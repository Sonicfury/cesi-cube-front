import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {SessionService} from "../../services/session.service";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {AuthorizationService} from "../../services/authorization.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {switchMap, tap} from "rxjs";
import {User} from "../../models/user";
import {CitoyenService} from "../../services/citoyen.service";
import {Citoyen, CitoyenInterface} from "../../models/citoyen";

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
    private _citoyenService: CitoyenService,
  ) {
    super('register-form', _authorizationService)
  }

  ngOnInit(): void {
    this.buildForm();
  }

  onSubmit() {
    if (this.nameFormGroup.valid && this.contactFormGroup.valid && this.credentialsFormGroup.valid) {
      this.isLoading = true;
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

      const citoyen = {
        firstname,
        lastname,
        address1,
        address2,
        zipCode,
        city,
        primaryPhone,
        secondaryPhone,
        birthdate } as CitoyenInterface
      console.log(citoyen)

      this._userService.register(email, password)
        .pipe(
          tap(user => console.log(user)),
          switchMap((user: User) => this._citoyenService.register(citoyen, user.id)),
          tap(citoyen => console.log(citoyen))
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
        ]),

        lastname: this._formBuilder.control(null, [
        ]),

        birthdate: this._formBuilder.control(null, [

        ]),
      }
    )
    this.contactFormGroup = this._formBuilder.group(
      {
        address1: this._formBuilder.control(null, [

        ]),

        address2: this._formBuilder.control(null, [
        ]),

        zipCode: this._formBuilder.control(null, [

        ]),

        city: this._formBuilder.control(null, [

        ]),

        primaryPhone: this._formBuilder.control(null, [
        ]),

        secondaryPhone: this._formBuilder.control(null, [
        ]),
      }
    )

    this.credentialsFormGroup = this._formBuilder.group(
      {
        email: this._formBuilder.control(null, [
            Validators.email
        ]),
        password: this._formBuilder.control(null, [

        ])
      }
    )

    this.isLoading = false;
  }

}
