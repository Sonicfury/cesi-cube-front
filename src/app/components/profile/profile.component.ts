import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {ActivatedRoute} from "@angular/router";
import {SnackbarService} from "../../services/snackbar.service";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {RelationService, RelationInterface} from "../../services/relation.service";
import {ERelationType, Relation, RELATION_ICONS, RELATION_TYPES} from "../../models/relation";
import {environment} from "../../../environments/environment";
import {SessionService} from "../../services/session.service";
import {SessionState} from "../../services/session-state";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit {
  user!: User
  currentUser: User = this._sessionService.currentUser
  pendingRelations: Relation[] = []
  acceptedRelations: Relation[] = []
  isLoadingRelations = false

  constructor(private _authorizationService: AuthorizationService,
              private _userService: UserService,
              private _route: ActivatedRoute,
              private _relationService: RelationService,
              private _sessionService: SessionService,
              private _snackbarService: SnackbarService) {
    super('profile', _authorizationService);
  }

  ngOnInit(): void {
    this.loadUser()

    this._sessionService.watch((state: SessionState) => this.currentUser = this._sessionService.currentUser)


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
    return true
  }

  canSeeRelationActions() {
    if (!this.currentUser) {
      return false
    }

    return this.currentUser && (this.currentUser?.id !== this.user?.id)
  }

  canSeeRelationRequests() {
    if (!this.currentUser) {
      return false
    }

    return this.currentUser && (this.currentUser?.id === this.user?.id)
  }
}
