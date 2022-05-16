import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LoginFormComponent} from "./components/login-form/login-form.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {RegisterFormComponent} from "./components/register-form/register-form.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'login', component: LoginFormComponent},
  {path: 'register', component: RegisterFormComponent},
  // {path: 'login', component: LoginFormComponent, canActivate: [LoginGuard]},
  // {path: 'register', component: RegisterFormComponent, canActivate: [LoginGuard]},
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/'
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
