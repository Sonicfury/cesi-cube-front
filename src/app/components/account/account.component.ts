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
import {Subject, switchMap, tap} from "rxjs";


@Component({
  selector: 'app-profile',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent extends BaseComponent implements OnInit {
  currentUser: User
  api = environment.apiUrl

  isLoading = true;

  emailFormControl!: FormControl
  firstnameFormControl!: FormControl
  lastnameFormControl!: FormControl
  address1FormControl!: FormControl
  address2FormControl!: FormControl
  zipCodeFormControl!: FormControl
  cityFormControl!: FormControl
  primaryPhoneFormControl!: FormControl
  secondaryPhoneFormControl!: FormControl
  avatar?: File

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
  }

  ngOnInit(): void {
    this.initForm()
    this.initFormGroups()
  }

  initForm() {
    this.emailFormControl = new FormControl(this.currentUser.email, [Validators.required, Validators.email])
    this.firstnameFormControl = new FormControl(this.currentUser.firstname, [Validators.required])
    this.lastnameFormControl = new FormControl(this.currentUser.lastname, [Validators.required])
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
    const fileReader = new FileReader()
    const onloadFile$ = new Subject()
    fileReader.onload = (event: any) => onloadFile$.next(event)

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

    onloadFile$
      .pipe(
        tap(_ => this.avatar && this.avatar.size >= 4000000 && this._snackbarService.error('La taille d\'image maximum autorisée est de 4 Mo')),
        tap((event: any) => {
          const base64 = event.target.result.split('base64,')[1]
          user.avatar = (this.avatar && this.avatar.size < 4000000 && base64) ? base64 : user.avatar
        }),
        switchMap(_ => this._userService.update(user))
      ).subscribe(user => {
      this._sessionService.currentUser = user
      delete this.avatar
      this._snackbarService.success('Votre profil a correctement été mis à jour !')
    })

    this.avatar && fileReader.readAsDataURL(this.avatar)
  }

  onRemoveImage() {
    delete this.currentUser.avatar
    console.log(this.currentUser)
    this._userService.update(this.currentUser)
      .subscribe(user => {
        this._sessionService.currentUser = user
        delete this.avatar
        this._snackbarService.success('Votre profil a correctement été mis à jour !')
      })
  }
}
