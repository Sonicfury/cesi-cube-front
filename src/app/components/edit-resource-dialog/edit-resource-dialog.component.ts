import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Resource} from "../../models/resource";
import {Type} from "../../models/type";
import {Category} from "../../models/category";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TypeService} from "../../services/type.service";
import {CategoryService} from "../../services/category.service";
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../services/resource.service";
import {SnackbarService} from "../../services/snackbar.service";
import {ERelationType, RELATION_ICONS, RELATION_TYPES, RelationType} from "../../models/relation-type";
import {RelationService} from "../../services/relation.service";

@Component({
  selector: 'app-edit-resource-dialog',
  templateUrl: './edit-resource-dialog.component.html',
  styleUrls: ['./edit-resource-dialog.component.scss']
})
export class EditResourceDialogComponent implements OnInit {
  api = environment.apiUrl.slice(0, -4)
  types: Type[] = this._typeService.types
  categories: Category[] = this._categoryService.categories
  relationTypes: RelationType[] = this._relationService.relationTypes
  mediaFile!: File
  resourceMedia!: File
  isLoadingMedia = false

  resource = {...this.data}

  resourceFormGroup: FormGroup

  titleFormControl = new FormControl(this.data.title, [Validators.required])
  richTextContentFormControl = new FormControl(this.data.richTextContent, [Validators.required])
  relationTypesFormControl = new FormControl(this.data.relationTypes)
  typeFormControl = new FormControl(this.data.type?.id, [Validators.required])
  categoryFormControl = new FormControl(this.data.type?.id, [Validators.required])

  @ViewChild("mediaRef", {read: ElementRef}) mediaRef!: ElementRef

  constructor(private _typeService: TypeService,
              private _categoryService: CategoryService,
              private _relationService: RelationService,
              private _resourceService: ResourceService,
              private _snackbarService: SnackbarService,
              @Inject(MAT_DIALOG_DATA) public data: Resource) {

    this.resourceFormGroup = new FormGroup({
      title: this.titleFormControl,
      richTextContent: this.richTextContentFormControl,
      relationTypes: this.relationTypesFormControl,
      type: this.typeFormControl,
      category: this.categoryFormControl
    })
  }

  ngOnInit(): void {
    this.resourceFormGroup.valueChanges
      .subscribe(formGroup => {
        formGroup.category = this.categories.find(c => c.id === formGroup.category)
        formGroup.type = this.types.find(t => t.id === formGroup.type)
        this.resource = {...formGroup, mediaUrl: this.resource.mediaUrl, id: this.resource.id}
      })
  }

  getScopeLabel(name?: string): string {
    return RELATION_TYPES.get(name as ERelationType) as string
  }

  getScopeIcon(name?: string): string {
    return RELATION_ICONS.get(name as ERelationType) as string
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

      this.isLoadingMedia = false
      this.resource = {...this.resource, mediaUrl: event.target.result.split('base64,')[1]}
      this.mediaRef.nativeElement.src = event.target.result
      this.resourceMedia = event.target.result
    }

    this.mediaFile && fileReader.readAsDataURL(this.mediaFile)
  }

  onRemoveMedia() {
    // @ts-ignore
    delete this.mediaFile
    // @ts-ignore
    delete this.resourceMedia
    delete this.resource.mediaUrl
  }

}
