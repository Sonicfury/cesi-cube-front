import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LoginFormComponent} from "./components/login-form/login-form.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {RegisterFormComponent} from "./components/register-form/register-form.component";
import {CanActivateApp} from "./services/can-activate-app.guard";
import {CanActivateLogin} from "./services/can-activate-login.guard";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [CanActivateApp]},
  {path: 'login', component: LoginFormComponent, canActivate: [CanActivateLogin]},
  {path: 'register', component: RegisterFormComponent, canActivate: [CanActivateLogin]},
  {path: '', pathMatch: 'full', redirectTo: '/'},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
