import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {SnackbarService} from "../../services/snackbar.service";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {RelationService, RelationInterface} from "../../services/relation.service";
import {ERelationType, Relation, RELATION_ICONS, RELATION_TYPES} from "../../models/relation";
import {environment} from "../../../environments/environment";
import {SessionService} from "../../services/session.service";
import {SessionState} from "../../services/session-state";
import {filter, iif, Subscription, switchMap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit, OnDestroy {
  user!: User
  nav$!: Subscription
  currentUser: User = this._sessionService.currentUser
  pendingRelations: Relation[] = []
  acceptedRelations: Relation[] = []
  isLoadingRelations = false
  loadingRelationAccept: Relation[] = []
  loadingRelationDelete: Relation[] = []

  constructor(private _authorizationService: AuthorizationService,
              private _userService: UserService,
              private _route: ActivatedRoute,
              private _router: Router,
              private _relationService: RelationService,
              private _sessionService: SessionService,
              private _dialog: MatDialog,
              private _snackbarService: SnackbarService) {
    super('profile', _authorizationService);

    this.nav$ = this._router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit(): void {
    this.loadUser()

    this._sessionService.watch((state: SessionState) => this.currentUser = this._sessionService.currentUser)
  }

  ngOnDestroy() {
    this.nav$.unsubscribe()
  }

  loadUser() {
    const id = this._route.snapshot.paramMap.get('id') as string

    this._userService.get(Number(id))
      .subscribe({
        next: user => {
          this.user = user
          this.loadRelations()
        }
      })
  }

  loadRelations() {
    this.isLoadingRelations = true

    if (this.currentUser?.id === this.user?.id) {
      this.pendingRelations = this._relationService.pending
      this.acceptedRelations = this._relationService.accepted
      this._relationService.watch((requests: RelationInterface) => {
        this.pendingRelations = requests.pending
        this.acceptedRelations = requests.accepted
        this.isLoadingRelations = false
      })
    } else {
      this._relationService.get(this.user?.id).subscribe(relations => {
        this.pendingRelations = relations.filter(r => (r.secondUser?.id === this.user?.id) && !r.isAccepted)
        this.acceptedRelations = relations.filter(r => r.isAccepted)
        this.isLoadingRelations = false
      })
    }
  }

  getMediaUrl(url?: any) {
    return `${environment.apiUrl.slice(0, -4)}${url}`
  }

  getTypeLabel(type?: ERelationType) {
    return RELATION_TYPES.get(type as ERelationType)
  }

  getIcon(type?: ERelationType) {
    return RELATION_ICONS.get(type as ERelationType)
  }

  canSeeRelations() {
    return this._relationService.accepted.some(r => r.firstUser?.id === this.user?.id || r.secondUser?.id === this.user?.id)
  }

  canSeeRelationActions() {
    if (!this.currentUser) {
      return false
    }

    return this.currentUser && (this.currentUser?.id !== this.user?.id)
  }

  canSeeRelationRequestActions() {
    if (!this.currentUser) {
      return false
    }

    return this.currentUser && this.currentUser?.id === this.user?.id
  }

  canSeeRelationRequests() {
    if (!this.currentUser) {
      return false
    }

    return this.currentUser && (this.currentUser?.id === this.user?.id)
  }

  onAccept(relation: Relation) {
    this.loadingRelationAccept.push(relation)
    this._relationService.accept(relation).subscribe({
      next: _ => {
        this._snackbarService.success('La relation a été accepté avec succès.')
        this.pendingRelations = this.pendingRelations.filter(pr => pr.id !== relation.id)
      },
      error: _ => {
        this._snackbarService.error('Une erreur est survenue pendant l\'acceptation de la relation.')
        this.loadingRelationAccept = this.loadingRelationAccept.filter(lra => lra.id !== relation.id)
      }
    })
  }

  isLoadingRelationAccept(relation: Relation) {
    return this.loadingRelationAccept.some(lra => lra.id === relation.id)
  }

  isLoadingRelationDelete(relation: Relation) {
    return this.loadingRelationDelete.some(lrd => lrd.id === relation.id)
  }

  onDelete(relation: Relation, confirm = false) {
    this.loadingRelationDelete.push(relation)
    if (confirm) {
      const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Êtes-vous sûr.e ?',
          body: `Cette action va supprimer la relation et est irréversible.`
        }
      })

      dialogRef.afterClosed().pipe(
        filter(confirm => confirm === true),
        switchMap(_ => this._relationService.delete(relation))
      ).subscribe({
        next: _ => {
          this._snackbarService.success('La relation a été supprimée avec succès.')
          this.acceptedRelations = this.acceptedRelations.filter(ar => ar.id !== relation.id)
        },
        error: _ => {
          this._snackbarService.error('Une erreur est survenue pendant la suppression de la relation.')
          this.loadingRelationDelete = this.loadingRelationDelete.filter(lrd => lrd.id !== relation.id)
        }
      })

      return
    }

    this._relationService.delete(relation).subscribe({
      next: _ => {
        this._snackbarService.success('La relation a été supprimée avec succès.')
        this.pendingRelations = this.pendingRelations.filter(pr => pr.id !== relation.id)
      },
      error: _ => {
        this._snackbarService.error('Une erreur est survenue pendant la suppression de la relation.')
        this.loadingRelationDelete = this.loadingRelationDelete.filter(lrd => lrd.id !== relation.id)
      }
    })
  }
}
