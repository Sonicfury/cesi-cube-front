import {Component, Input, OnInit} from '@angular/core';
import {Resource, SCOPE_LABELS} from "../../models/resource";
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {environment} from "../../../environments/environment";
import {SessionService} from "../../services/session.service";
import {SessionState} from "../../services/session-state";
import {SnackbarService} from "../../services/snackbar.service";
import {UserService} from "../../services/user.service";
import {filter, switchMap, tap} from "rxjs";
import {ResourceService} from "../../services/resource.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent extends BaseComponent implements OnInit {
  @Input() resource!: Resource
  apiUrl = environment.apiUrl
  scopeLabels = SCOPE_LABELS

  isDeleteLoading = false
  isBookmarkLoading = false
  isFavoriteLoading = false
  isThumbUpLoading = false

  constructor(private _authorizationService: AuthorizationService,
              private _sessionService: SessionService,
              private _snackbarService: SnackbarService,
              private _resourceService: ResourceService,
              private _userService: UserService,
              private _dialog: MatDialog) {
    super('resource', _authorizationService);
  }

  ngOnInit(): void {
  }

  isAction(action: string) {
    switch (action) {
      case 'bookmark':
        return this.resource.readLater.some((item: { id: number }) => item.id === this._sessionService.currentUser.id)
      case 'favorite':
        return this.resource.favorites.some((item: { id: number }) => item.id === this._sessionService.currentUser.id)
      case 'thumbUp':
        return this.resource.exploited.some((item: { id: number }) => item.id === this._sessionService.currentUser.id)
      default:
        return false
    }
  }

  onCardAction(action: string) {
    if (this._sessionService.state !== SessionState.CONNECTED) {
      this._snackbarService.error('Vous devez être connecté pour effectuer cette action.')
    }

    switch (action) {
      case 'bookmark':
        this.isBookmarkLoading = true
        break
      case 'favorite':
        this.isFavoriteLoading = true
        break
      case 'thumbUp':
        this.isThumbUpLoading = true
        break
      default:
        break
    }

    this._userService.resourceAction(action, this.resource)
      .subscribe({
        next: resource => {
          this.resource = resource
          this.isBookmarkLoading = false
          this.isFavoriteLoading = false
          this.isThumbUpLoading = false
        },
        error: _ => this._snackbarService.error('Une erreur est survenue.')
      })
  }

  isCurrentUserAuthor() {
    return this.resource.author?.id === this._sessionService.currentUser.id
  }

  onDelete() {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data:
        {
          title: 'Êtes-vous sûr ?',
          body: `Cette action va supprimer la Ressource "${this.resource.title}" et est irréversible.`
        }
    })

    dialogRef.afterClosed().pipe(
      filter(confirm => confirm === true),
      tap(_ => this.isDeleteLoading = true),
      switchMap(_ => this._resourceService.delete(this.resource.id as number))
    ).subscribe({
      next: _ => {
        this._snackbarService.success('La ressource a été supprimée avec succès.')
        this._resourceService.onResourceDelete$.next(true)
        this.isDeleteLoading = false
      },
      error: _ => {
        this._snackbarService.error('Une erreur est survenue pendant la suppression de la ressource.')
        this.isDeleteLoading = false
      },
    })
  }
}
