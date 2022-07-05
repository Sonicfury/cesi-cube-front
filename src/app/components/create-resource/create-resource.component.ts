import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from "../base-component";
import {AuthorizationService} from "../../services/authorization.service";
import {ResourceService} from "../../services/resource.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SnackbarService} from "../../services/snackbar.service";
import {environment} from "../../../environments/environment";
import {TypeService} from "../../services/type.service";
import {CategoryService} from "../../services/category.service";
import {Type} from "../../models/type";
import {Category} from "../../models/category";
import {ERelationType, RELATION_ICONS, RELATION_TYPES, RelationType} from "../../models/relation-type";
import {RelationService} from "../../services/relation.service";

@Component({
  selector: 'app-create-resource',
  templateUrl: './create-resource.component.html',
  styleUrls: ['./create-resource.component.scss']
})
export class CreateResourceComponent extends BaseComponent implements OnInit, AfterViewInit {
  resource = this._resourceService.currentlyCreating
  resourceMedia = this._resourceService.currentlyCreatingMedia
  api = environment.apiUrl
  isLoadingPublish = false
  isLoadingMedia = false
  resourceFormGroup: FormGroup
  mediaFile!: File

  types: Type[] = this._typeService.types
  categories: Category[] = this._categoryService.categories
  relationTypes: RelationType[] = this._relationService.relationTypes

  titleFormControl = new FormControl(this.resource.title, [Validators.required])
  richTextContentFormControl = new FormControl(this.resource.richTextContent, [Validators.required])
  relationTypesFormControl = new FormControl(this.resource.relationTypes)
  typeFormControl = new FormControl(this.resource.type?.id, [Validators.required])
  categoryFormControl = new FormControl(this.resource.category?.id, [Validators.required])

  @ViewChild("mediaRef", {read: ElementRef}) mediaRef!: ElementRef

  constructor(private _authorizationService: AuthorizationService,
              private _resourceService: ResourceService,
              private _snackbarService: SnackbarService,
              private _typeService: TypeService,
              private _categoryService: CategoryService,
              private _relationService: RelationService
  ) {
    super('create-resource', _authorizationService);
    this.resourceFormGroup = new FormGroup({
      title: this.titleFormControl,
      richTextContent: this.richTextContentFormControl,
      relationTypes: this.relationTypesFormControl,
      type: this.typeFormControl,
      category: this.categoryFormControl,
    })

    _typeService.watch((types: Type[]) => {
      this.types = types
      this.typeFormControl.setValue(this.resource.type?.id)
    })
    _categoryService.watch((categories: Category[]) => {
      this.categories = categories
      this.categoryFormControl.setValue(this.resource.category?.id)
    })
    _relationService.relationTypes$.subscribe((relationTypes: RelationType[]) => {
      this.relationTypes = relationTypes
    })
  }

  ngOnInit(): void {
    this.listenFormChanges()
  }

  ngAfterViewInit() {
    if (this.mediaRef && this.resourceMedia) {
      this.mediaRef.nativeElement.src = this.resourceMedia
      this.isLoadingMedia = false
    }
  }

  getScopeLabel(name?: string): string {
    return RELATION_TYPES.get(name as ERelationType) as string
  }

  getScopeIcon(name?: string): string {
    return RELATION_ICONS.get(name as ERelationType) as string
  }

  listenFormChanges() {
    this.resourceFormGroup.valueChanges.subscribe(resource => {
      resource.category = this.categories.find(c => c.id === resource.category)
      resource.type = this.types.find(t => t.id === resource.type)
      this._resourceService.currentlyCreating = resource
    })
  }

  onSubmit() {
    this.resourceFormGroup.disable()
    this.isLoadingPublish = true

    this._resourceService.create().subscribe(
      resource => {
        this.isLoadingPublish = false
        this.resourceFormGroup.enable()
        this._snackbarService.success(`La ressource ${resource.title} a été créé avec succès !`)
        this.onReset()
      }
    )
  }

  onMediaInput(event: any) {
    this.isLoadingMedia = true
    this.mediaFile = event.target?.files[0] ?? null
    const fileReader = new FileReader()

    fileReader.onload = (event: any) => {
      if (this.mediaFile && this.mediaFile.size > 10000000) {
        this._snackbarService.error('La taille d\'image maximum autorisée est de 4 Mo')

        return
      }

      this._resourceService.currentlyCreating = {
        ...this._resourceService.currentlyCreating,
        mediaUrl: event.target.result.split('base64,')[1]
      }
      this.mediaRef.nativeElement.src = event.target.result
      this._resourceService.currentlyCreatingMedia = event.target.result
      this.isLoadingMedia = false
    }

    this.mediaFile && fileReader.readAsDataURL(this.mediaFile)
  }

  onRemoveMedia() {
    // @ts-ignore
    delete this.mediaFile
    this._resourceService.removeCurrentlyCreatingMedia()
    // @ts-ignore
    delete this.resourceMedia
    delete this.resource.mediaUrl
    this._resourceService.currentlyCreating = this.resource
  }

  onReset() {
    this.resourceFormGroup.reset()
    this.onRemoveMedia()
  }
}
