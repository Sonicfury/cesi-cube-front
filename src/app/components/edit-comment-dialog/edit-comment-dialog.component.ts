import {Component, Inject, OnInit} from '@angular/core';
import {ResourceService} from "../../services/resource.service";
import {SnackbarService} from "../../services/snackbar.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FormControl, Validators} from "@angular/forms";
import {Comment} from "../../models/comment";

@Component({
  selector: 'app-edit-comment-dialog',
  templateUrl: './edit-comment-dialog.component.html',
  styleUrls: ['./edit-comment-dialog.component.scss']
})
export class EditCommentDialogComponent implements OnInit {
  comment = {...this.data}

  commentFormControl = new FormControl(this.data.content, [Validators.min(3)])

  constructor(
    private _resourceService: ResourceService,
    private _snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: Comment
  ) { }

  ngOnInit(): void {

    this.commentFormControl.valueChanges.subscribe(content => this.comment.content = content)
  }

}
