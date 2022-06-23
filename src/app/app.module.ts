import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoginFormComponent} from './components/login-form/login-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HomeComponent} from './components/home/home.component';
import {AccountComponent} from './components/account/account.component';
import {ProfileRessourcesComponent} from './components/profile-ressources/profile-ressources.component';
import {NavComponent} from "./components/nav/nav.component";
import {RegisterFormComponent} from './components/register-form/register-form.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatStepperModule} from "@angular/material/stepper";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSidenavModule} from "@angular/material/sidenav";
import {SnackBarComponent} from "./components/snackbar/snackbar.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {TokenizerInterceptor} from "./interceptors/tokenizer.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    SnackBarComponent,
    NavComponent,
    LoginFormComponent,
    HomeComponent,
    AccountComponent,
    ProfileRessourcesComponent,
    RegisterFormComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatSnackBarModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSidenavModule,
    MatProgressSpinnerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenizerInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
