import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {SnackbarService} from "../../services/snackbar.service";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {RelationInterface, RelationService} from "../../services/relation.service";
import {Relation} from "../../models/relation";
import {environment} from "../../../environments/environment";
import {SessionService} from "../../services/session.service";
import {SessionState} from "../../services/session-state";
import {filter, Subscription, switchMap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {ERelationType, RELATION_ICONS, RELATION_TYPES} from "../../models/relation-type";
import {ResourceService} from "../../services/resource.service";
import {Resource} from "../../models/resource";
import {LaravelQueryBuilder} from "../../helpers/filters.helper";
import {EStatus} from "../../models/status";
import {ERole} from "../../models/role";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit, OnDestroy {
  user!: User
  nav$!: Subscription
  currentUser: User = this._sessionService.currentUser
  acceptedPage = 1
  pendingPage = 1
  isLoadingPendingResources = false
  isLoadingAcceptedResource = false
  isLoadingRelations = false
  loadingRelationAccept: Relation[] = []
  loadingRelationDelete: Relation[] = []
  pendingRelations: Relation[] = []
  acceptedRelations: Relation[] = []
  acceptedResources: Resource[] = []
  pendingResources: Resource[] = []
  filter?: string
  resourceStatus = EStatus
  relationTypes = ERelationType

  isConjointBtnVisible = false
  isConjointBtnDisabled = false
  isAmiBtnVisible = false
  isAmiBtnDisabled = false
  isFamilleBtnVisible = false
  isFamilleBtnDisabled = false
  isProfessionnelBtnVisible = false
  isProfessionnelBtnDisabled = false
  isAutresBtnVisible = false
  isAutresBtnDisabled = false

  constructor(private _authorizationService: AuthorizationService,
              private _userService: UserService,
              private _route: ActivatedRoute,
              private _router: Router,
              private _relationService: RelationService,
              private _resourceService: ResourceService,
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

  getUserFilter(): string {
    const qb = new LaravelQueryBuilder()
    qb.addFilter('user_id', '=', this.user.id as number)
      .addSort('updated_at', 'desc')
      .addSort('created_at', 'desc')

    return qb.query
  }

  getResourceStatusFilter(status: EStatus) {
    const qb = new LaravelQueryBuilder()
    qb.addFilter('user_id', '=', this.user.id as number)
      .addFilter('status', '=', status)
      .addSort('updated_at', 'desc')
      .addSort('created_at', 'desc')

    return qb.query
  }

  ngOnInit(): void {
    this.loadUser()
    this.loadResources()
    this._sessionService.watch((state: SessionState) => this.currentUser = this._sessionService.currentUser)
  }

  ngOnDestroy() {
    this.nav$.unsubscribe()
  }

  loadResources() {
    this.isLoadingPendingResources = true
    this.isLoadingAcceptedResource = true
    this._resourceService.get(1, this.filter)
      .subscribe((resources: Resource[]) => {
        this.acceptedResources = resources.filter(r => r.status === EStatus.ACCEPTED)
        this.pendingResources = resources.filter(r => r.status === EStatus.PENDING)
        this.isLoadingPendingResources = false
        this.isLoadingAcceptedResource = false
        this.buttonChecks()
      })
  }

  loadUser() {
    const id = this._route.snapshot.paramMap.get('id') as string

    this._userService.get(Number(id))
      .subscribe({
        next: user => {
          this.user = user
          this.filter = this.getUserFilter()
          this.loadRelations()
          this.loadResources()
          this.buttonChecks()
        }
      })
  }

  loadRelations() {
    this.isLoadingRelations = true

    if (this.currentUser?.id === this.user?.id) {
      this.pendingRelations = this._relationService.pending
      this.acceptedRelations = this._relationService.accepted
      this._relationService.watch((requests: RelationInterface) => {
        this.pendingRelations = requests.pending.filter(r => (r.secondUser?.id === this.user?.id) && !r.isAccepted)
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

  onScroll(status: EStatus) {
    let page = status === EStatus.PENDING ? this.pendingPage : this.acceptedPage

    if (page < this._resourceService.lastPage) {
      page += 1

      this._resourceService.get(page, this.getResourceStatusFilter(status))
        .subscribe(resources => {
          if (status === EStatus.ACCEPTED) {
            this.acceptedResources = [...new Set([...this.acceptedResources, ...resources])]
          }

          if (status === EStatus.PENDING) {
            this.pendingResources = [...new Set([...this.pendingResources, ...resources])]
          }
        })
    }
  }

  trackBy(index: number, resource: Resource) {
    return resource.id
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
    if (this._relationService.accepted.some(r => r.firstUser?.id === this.user?.id || r.secondUser?.id === this.user?.id)){
      return true
    }

    return (this.currentUser.roles.some(r => [ERole.ADMIN, ERole.SUPER_ADMIN].includes(r.name as ERole)))
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

  getRelationWithCurrentUser(type: ERelationType): Relation | undefined {
    const relations = [...this._relationService.accepted, ...this._relationService.pending]
      .filter(relation => relation.firstUser?.id === this.user?.id || relation.secondUser?.id === this.user?.id)

    return relations.find(r => r.relationType === type)
  }

  isAddButtonDisabled(type: ERelationType): boolean {
    const relation = this.getRelationWithCurrentUser(type)

    if (!relation){
      return false
    }

    return true
  }

  isAddButtonVisible(type: ERelationType): boolean {
    const relation = this.getRelationWithCurrentUser(type)

    if (!relation) {
      return true
    }

    return !relation.isAccepted;
  }

  buttonChecks() {
    this.isConjointBtnVisible = this.isAddButtonVisible(ERelationType.CONJOINT)
    this.isConjointBtnDisabled = this.isAddButtonDisabled(ERelationType.CONJOINT)
    this.isAmiBtnVisible = this.isAddButtonVisible(ERelationType.AMI)
    this.isAmiBtnDisabled = this.isAddButtonDisabled(ERelationType.AMI)
    this.isFamilleBtnVisible = this.isAddButtonVisible(ERelationType.FAMILLE)
    this.isFamilleBtnDisabled = this.isAddButtonDisabled(ERelationType.FAMILLE)
    this.isProfessionnelBtnVisible = this.isAddButtonVisible(ERelationType.PROFESSIONNEL)
    this.isProfessionnelBtnDisabled = this.isAddButtonDisabled(ERelationType.PROFESSIONNEL)
    this.isAutresBtnVisible = this.isAddButtonVisible(ERelationType.AUTRES)
    this.isAutresBtnDisabled = this.isAddButtonDisabled(ERelationType.AUTRES)
  }

  onAddUserAs(type: ERelationType){
    const relation = new Relation()

    relation.relationType = type
    relation.firstUser = this.currentUser
    relation.secondUser = this.user

    this._relationService.create(relation).subscribe({
      next: _ => {
        this._snackbarService.success('La relation a été créée avec succès.')
        this.buttonChecks()
      },
      error: _ => {
        this._snackbarService.error('Une erreur est survenue pendant la création de la relation.')
      }
    })
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
