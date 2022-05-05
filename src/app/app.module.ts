import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { LoginFormComponent } from './components/login-form/login-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './components/home/home.component';
import { ProfilComponent } from './components/profil/profil.component';
import { ProfilInfoComponent } from './components/profil-info/profil-info.component';
import { ProfilRessourcesComponent } from './components/profil-ressources/profil-ressources.component';
import {NavComponent} from "./components/nav/nav.component";
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatStepperModule} from "@angular/material/stepper";

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginFormComponent,
    HomeComponent,
    ProfilComponent,
    ProfilInfoComponent,
    ProfilRessourcesComponent,
    RegisterFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatStepperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
