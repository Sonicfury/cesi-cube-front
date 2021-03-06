import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LoginFormComponent} from "./components/login-form/login-form.component";
import {AccountComponent} from "./components/account/account.component";
import {RegisterFormComponent} from "./components/register-form/register-form.component";
import {CanActivateApp} from "./services/can-activate-app.guard";
import {CanActivateLogin} from "./services/can-activate-login.guard";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {ResourceDetailComponent} from "./components/resource-detail/resource-detail.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {SavedResourcesComponent} from "./components/saved-resources/saved-resources.component";
import {PendingResourcesComponent} from "./components/pending-resources/pending-resources.component";
import {ProfilesListComponent} from "./components/profiles-list/profiles-list.component";
import { StatisticsComponent } from './components/statistics/statistics.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'resources/:id',
    component: ResourceDetailComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'profiles/:id',
    component: ProfileComponent,
    canActivate: [CanActivateApp],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'saved/:type',
    component: SavedResourcesComponent,
    canActivate: [CanActivateApp],
    runGuardsAndResolvers: 'always'
  },{
    path: 'admin/resources',
    component: PendingResourcesComponent,
    canActivate: [CanActivateApp]
  },
  {
    path: 'admin/profiles',
    component: ProfilesListComponent,
    canActivate: [CanActivateApp]
  },
  {
    path: 'admin/statistics',
    component: StatisticsComponent,
    canActivate: [CanActivateApp]
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [CanActivateApp]
  },
  {
    path: 'login',
    component: LoginFormComponent,
    canActivate: [CanActivateLogin]
  },
  {
    path: 'register',
    component: RegisterFormComponent,
    canActivate: [CanActivateLogin]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled', onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
