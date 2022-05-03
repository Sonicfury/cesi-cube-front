import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { LoginFormComponent } from './components/login-form/login-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './components/home/home.component';
import { NavTopComponent } from './components/layouts/nav-top/nav-top.component';
import { ProfilComponent } from './components/profil/profil.component';
import { ProfilInfoComponent } from './components/profil-info/profil-info.component';
import { ProfilRessourcesComponent } from './components/profil-ressources/profil-ressources.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    HomeComponent,
    NavTopComponent,
    ProfilComponent,
    ProfilInfoComponent,
    ProfilRessourcesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
