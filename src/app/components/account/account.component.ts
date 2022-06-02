import {Component, OnInit} from '@angular/core';
import {AuthorizationService} from "../../services/authorization.service";
import {BaseComponent} from "../base-component";
import {SessionService} from "../../services/session.service";
import {User} from "../../models/user";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-profile',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent extends BaseComponent implements OnInit {
  currentUser: User;

  isLoading = true;

  firstnameFormControl!: FormControl
  lastnameFormControl!: FormControl
  birthdateFormControl!: FormControl
  address1FormControl!: FormControl
  address2FormControl!: FormControl
  zipCodeFormControl!: FormControl
  cityFormControl!: FormControl
  primaryPhoneFormControl!: FormControl
  secondaryPhoneFormControl!: FormControl

  nameFormGroup!: FormGroup
  contactFormGroup!: FormGroup


  constructor(private _authorizationService: AuthorizationService,
              private _sessionService: SessionService,
              private _formBuilder: FormBuilder) {
    super('profile', _authorizationService)
    this.currentUser = this._sessionService.currentUser;
  }

  ngOnInit(): void {
    this.initForm()
    this.initFormGroups()
  }

  initForm() {
    this.firstnameFormControl = new FormControl(this.currentUser.firstname, [Validators.required])
    this.lastnameFormControl = new FormControl(this.currentUser.lastname, [Validators.required])
    this.birthdateFormControl = new FormControl(new Date(this.currentUser.birthDate as Date).toISOString().slice(0, 10), [Validators.required])
    this.address1FormControl = new FormControl(this.currentUser.address1, [Validators.required])
    this.address2FormControl = new FormControl(this.currentUser.address2 ?? '', [])
    this.zipCodeFormControl = new FormControl(this.currentUser.zipCode, [Validators.required])
    this.cityFormControl = new FormControl(this.currentUser.city, [Validators.required])
    this.primaryPhoneFormControl = new FormControl(this.currentUser.primaryPhone, [
      Validators.required,
      Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(12)
    ])
    this.secondaryPhoneFormControl = new FormControl(this.currentUser.secondaryPhone ?? '', [
      Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(12)
    ])
  }

  initFormGroups() {
    this.nameFormGroup = new FormGroup({
      firstname: this.firstnameFormControl,
      lastname: this.lastnameFormControl,
      birthdate: this.birthdateFormControl
    })

    this.contactFormGroup = new FormGroup({
      address1: this.address1FormControl,
      address2: this.address2FormControl,
      zipCode: this.zipCodeFormControl,
      city: this.cityFormControl,
      primaryPhone: this.primaryPhoneFormControl,
      secondaryPhone: this.secondaryPhoneFormControl
    })

    this.nameFormGroup.disable()
    this.contactFormGroup.disable()
  }

  onSubmit() {
    const user = new User(
      this.currentUser.email,
      // todo: modal to get current password. put the current password if it isn't updated
      this.lastnameFormControl.value,
      this.firstnameFormControl.value,
      this.address1FormControl.value,
      this.zipCodeFormControl.value,
      this.cityFormControl.value,
      this.primaryPhoneFormControl.value,
      this.secondaryPhoneFormControl.value,
      this.address2FormControl.value,
      this.birthdateFormControl.value
    )
  }
}
