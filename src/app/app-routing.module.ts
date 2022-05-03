import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LoginFormComponent} from "./components/login-form/login-form.component";
import {LoginGuard} from "./services/login.guard";
import {ProfilComponent} from "./components/profil/profil.component";
import {AuthGuard} from "./services/auth.guard";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'profil', component: ProfilComponent},
  {path: 'login', component: LoginFormComponent, canActivate: [LoginGuard]},

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
