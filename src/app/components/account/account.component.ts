import {Component, OnInit} from '@angular/core';
import {AuthorizationService} from "../../services/authorization.service";
import {BaseComponent} from "../base-component";
import {SessionService} from "../../services/session.service";
import {User} from "../../models/user";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {SnackbarService} from "../../services/snackbar.service";
import {MatDialog} from "@angular/material/dialog";
import {environment} from "../../../environments/environment";
import {SessionState} from "../../services/session-state";
import {Subject} from "rxjs";


@Component({
  selector: 'app-profile',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent extends BaseComponent implements OnInit {
  currentUser: User
  api = environment.apiUrl
  fileReader = new FileReader()
  onloadFile$ = new Subject()

  isLoading = true;

  emailFormControl!: FormControl
  firstnameFormControl!: FormControl
  lastnameFormControl!: FormControl
  birthdateFormControl!: FormControl
  address1FormControl!: FormControl
  address2FormControl!: FormControl
  zipCodeFormControl!: FormControl
  cityFormControl!: FormControl
  primaryPhoneFormControl!: FormControl
  secondaryPhoneFormControl!: FormControl
  avatar!: File
  avatarBase64: string = ''

  nameFormGroup!: FormGroup
  contactFormGroup!: FormGroup


  constructor(private _authorizationService: AuthorizationService,
              private _sessionService: SessionService,
              private _userService: UserService,
              private _snackbarService: SnackbarService,
              private _formBuilder: FormBuilder,
              private _dialog: MatDialog) {
    super('profile', _authorizationService)
    this.currentUser = this._sessionService.currentUser;
    this._sessionService.watch((state: SessionState) => this.currentUser = this._sessionService.currentUser)
    this.fileReader.onload = (event: any) => this.onloadFile$.next(event)
    this.onloadFile$.subscribe((event: any) => {
      this.avatarBase64 = event.target.result
      console.log(this.avatarBase64)
    })
  }

  ngOnInit(): void {
    this.initForm()
    this.initFormGroups()
  }

  initForm() {
    this.emailFormControl = new FormControl(this.currentUser.email, [Validators.required, Validators.email])
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
      email: this.emailFormControl,
      primaryPhone: this.primaryPhoneFormControl,
      secondaryPhone: this.secondaryPhoneFormControl
    })

    this.nameFormGroup.disable()
    this.contactFormGroup.disable()
  }

  onAvatarInput(event: any) {
    this.avatar = event.target?.files[0] ?? null
  }

  onSubmit() {
    const user = new User()

    user.id = this.currentUser.id
    user.email = this.emailFormControl.value ?? this.currentUser.email
    user.lastname = this.lastnameFormControl.value ?? this.currentUser.lastname
    user.firstname = this.firstnameFormControl.value ?? this.currentUser.firstname
    user.address1 = this.address1FormControl.value ?? this.currentUser.address1
    user.zipCode = this.zipCodeFormControl.value ?? this.currentUser.zipCode
    user.city = this.cityFormControl.value ?? this.currentUser.city
    user.primaryPhone = this.primaryPhoneFormControl.value ?? this.currentUser.primaryPhone
    user.secondaryPhone = this.secondaryPhoneFormControl.value ?? this.currentUser.secondaryPhone
    user.address2 = this.address2FormControl.value ?? this.currentUser.address2
    user.birthDate = this.birthdateFormControl.value ?? this.currentUser.birthDate
    user.avatar = this.avatarBase64 ?? this.currentUser.avatar

    this.fileReader.readAsDataURL(this.avatar)

    this._userService.update(user)
      .subscribe(user => {
        this._sessionService.currentUser = user
        this._snackbarService.success('Votre profil a correctement été mis à jour !')
      })
  }
}
