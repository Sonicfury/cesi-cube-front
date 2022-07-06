import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);
import {LoginFormComponent} from './components/login-form/login-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HomeComponent} from './components/home/home.component';
import {AccountComponent} from './components/account/account.component';
import {ProfileResourcesComponent} from './components/profile-ressources/profile-resources.component';
import {NavComponent} from "./components/nav/nav.component";
import {RegisterFormComponent} from './components/register-form/register-form.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
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
import {CommonModule, registerLocaleData} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";
import { ResourceComponent } from './components/resource/resource.component';
import { CreateResourceComponent } from './components/create-resource/create-resource.component';
import {MatSelectModule} from "@angular/material/select";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatMenuModule} from "@angular/material/menu";
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { EditResourceDialogComponent } from './components/edit-resource-dialog/edit-resource-dialog.component';
import { ResourceDetailComponent } from './components/resource-detail/resource-detail.component';
import { EditCommentDialogComponent } from './components/edit-comment-dialog/edit-comment-dialog.component';
import {ProfileCardComponent} from "./components/profile-card/profile-card.component";
import { ProfileComponent } from './components/profile/profile.component';
import {ClipboardModule} from "@angular/cdk/clipboard";
import {
  NgAisConfigureModule,
  NgAisHitsModule,
  NgAisIndexModule,
  NgAisInstantSearchModule,
  NgAisSearchBoxModule
} from "angular-instantsearch";
import { SearchDialogComponent } from './components/search-dialog/search-dialog.component';
import { GetScopesPipe } from './pipes/get-scopes.pipe';
import { SavedResourcesComponent } from './components/saved-resources/saved-resources.component';
import { FooterComponent } from './components/footer/footer.component';
import { PendingResourcesComponent } from './components/pending-resources/pending-resources.component';
import { ProfilesListComponent } from './components/profiles-list/profiles-list.component';
import { StatisticsComponent } from './components/statistics/statistics.component';


@NgModule({
  declarations: [
    AppComponent,
    SnackBarComponent,
    NavComponent,
    LoginFormComponent,
    HomeComponent,
    AccountComponent,
    ProfileResourcesComponent,
    RegisterFormComponent,
    PageNotFoundComponent,
    ResourceComponent,
    CreateResourceComponent,
    ConfirmationDialogComponent,
    EditResourceDialogComponent,
    ResourceDetailComponent,
    EditCommentDialogComponent,
    ProfileCardComponent,
    ProfileComponent,
    SearchDialogComponent,
    GetScopesPipe,
    SavedResourcesComponent,
    FooterComponent,
    PendingResourcesComponent,
    ProfilesListComponent,
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSelectModule,
    InfiniteScrollModule,
    MatProgressBarModule,
    MatMenuModule,
    ClipboardModule,
    NgAisInstantSearchModule,
    NgAisSearchBoxModule,
    NgAisHitsModule,
    NgAisIndexModule,
    NgAisConfigureModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenizerInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'fr-FR'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
