import {Component, Input, OnInit} from '@angular/core';
import {Resource} from "../../models/resource";
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
import {EditResourceDialogComponent} from "../edit-resource-dialog/edit-resource-dialog.component";
import {FormControl} from "@angular/forms";
import {EditCommentDialogComponent} from "../edit-comment-dialog/edit-comment-dialog.component";
import {Comment} from "../../models/comment";
import {EStatus} from "../../models/status";
import {ERole} from "../../models/role";

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent extends BaseComponent implements OnInit {
  @Input() resource!: Resource
  @Input() mode!: 'simple' | 'extended' | 'mini'

  apiUrl = environment.apiUrl

  isDeleteLoading = false
  isBookmarkLoading = false
  isFavoriteLoading = false
  isThumbUpLoading = false
  isEditLoading = false
  isCommentLoading = false
  isCommentEditLoading = false

  showComments = false
  commentFormControl = new FormControl('')

  constructor(private _authorizationService: AuthorizationService,
              private _sessionService: SessionService,
              private _snackbarService: SnackbarService,
              private _resourceService: ResourceService,
              private _userService: UserService,
              private _dialog: MatDialog) {
    super('resource', _authorizationService)
  }

  ngOnInit(): void {
  }


  isAction(action: string) {
    if (this._sessionService.state !== SessionState.CONNECTED) {
      return false
    }

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
      this._snackbarService.error('Vous devez ??tre connect?? pour effectuer cette action.')
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

  isIdAuthor(id?: number) {
    if (this._sessionService.state !== SessionState.CONNECTED) {
      return false
    }

    return id === this._sessionService.currentUser.id
  }

  isResourcePending(resource: Resource): boolean {
    return resource.status === EStatus.PENDING
  }

  onDelete() {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data:
        {
          title: '??tes-vous s??r.e ?',
          body: `Cette action va supprimer la Ressource "${this.resource.title}" et est irr??versible.`
        }
    })

    dialogRef.afterClosed().pipe(
      filter(confirm => confirm === true),
      tap(_ => this.isDeleteLoading = true),
      switchMap(_ => this._resourceService.delete(this.resource.id as number))
    ).subscribe({
      next: _ => {
        this._snackbarService.success('La ressource a ??t?? supprim??e avec succ??s.')
      },
      error: _ => {
        this._snackbarService.error('Une erreur est survenue pendant la suppression de la ressource.')
        this.isDeleteLoading = false
      },
    })
  }

  onEdit() {
    const dialogRef = this._dialog.open(EditResourceDialogComponent, {
      data: this.resource
    })

    dialogRef.afterOpened().subscribe(_ => this.isEditLoading = true)

    dialogRef.afterClosed().pipe(
      tap(data => data && (this.isEditLoading = false)),
      filter((data: Resource) => !!data.id),
      switchMap((data: Resource) => this._resourceService.update(data))
    ).subscribe({
      next: resource => {
        this.resource = resource
        this._snackbarService.success('La ressource a ??t?? mise ?? jour avec succ??s.')
        this.isEditLoading = false
      },
      error: _ => {
        this._snackbarService.error('Une erreur est survenue pendant la mise ?? jour de la ressource.')
        this.isEditLoading = false
      }
    })
  }

  onComment() {
    if (this.commentFormControl.value.length < 3) {
      this._snackbarService.info('Votre commentaire doit compter au moins 3 caract??res')
      return
    }

    if (this._sessionService.state !== SessionState.CONNECTED) {
      this._snackbarService.error('Vous devez ??tre connect?? pour publier un commentaire.')
    }

    this.isCommentLoading = true
    this._resourceService.comment(this.resource.id as number, this.commentFormControl.value)
      .subscribe({
        next: resource => {
          this.resource = resource
          this._snackbarService.success('Votre commentaire a ??t?? envoy?? avec succ??s.')
          this.isCommentLoading = false
        },
        error: _ => {
          this._snackbarService.error('')
          this.isCommentLoading = false
        }
      })
  }

  onCommentEdit(comment: Comment) {
    const dialogRef = this._dialog.open(EditCommentDialogComponent, {
      data: comment
    })

    dialogRef.afterOpened().subscribe(_ => this.isCommentEditLoading = true)

    dialogRef.afterClosed().pipe(
      filter((data: Comment) => !!data.id),
      switchMap((comment: Comment) => this._resourceService.updateComment(this.resource.id as number, comment))
    ).subscribe({
      next: resource => {
        this.resource = resource
        this.isCommentEditLoading = false
        this._snackbarService.success('Le commentaire a ??t?? mis ?? jour avec succ??s.')
      },
      error: _ => {
        this._snackbarService.error('Une erreur est survenue pendant la suppression du commentaire.')
        this.isCommentEditLoading = false
      },
    })

  }

  onCommentDelete(id?: number) {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: {
        title: '??tes-vous s??r.e ?',
        body: `Cette action va supprimer le commentaire s??lectionn?? et est irr??versible.`
      }
    })

    dialogRef.afterClosed().pipe(
      filter(confirm => confirm === true),
      tap(_ => this.isCommentLoading = true),
      switchMap(_ => this._resourceService.deleteComment(this.resource.id as number, id as number))
    ).subscribe({
      next: resource => {
        this.resource = resource
        this.isCommentLoading = false
        this._snackbarService.success('Le commentaire a ??t?? supprim??e avec succ??s.')
      },
      error: _ => {
        this._snackbarService.error('Une erreur est survenue pendant la suppression du commentaire.')
        this.isCommentLoading = false
      },
    })
  }

  getMediaUrl(url?: any): string {
    return `${this.apiUrl.slice(0, -4)}${url}`
  }

  getCommentAuthorBadge(id?: number): string {
    switch (id) {
      case this.resource.author?.id:
        return 'badge badge-secondary font-semibold'
      case this._sessionService.currentUser.id:
        return 'badge badge-primary font-semibold'
      default:
        return 'font-medium'
    }
  }

  canHandleResource(resource: Resource): boolean {
    if (!this._sessionService.currentUser) {
      return false
    }

    if (this.isIdAuthor(resource.author?.id)) {
      return true
    }

    return this._sessionService.currentUser.roles?.some(r => [ERole.MODERATOR, ERole.ADMIN, ERole.SUPER_ADMIN].includes(r.name as ERole))
  }

  canHandleComment(comment: Comment): boolean {
    if (this.isIdAuthor(comment.author?.id)) {
      return true
    }

    return this._sessionService.currentUser.roles.some(r => [ERole.MODERATOR, ERole.ADMIN, ERole.SUPER_ADMIN].includes(r.name as ERole))
  }
}
