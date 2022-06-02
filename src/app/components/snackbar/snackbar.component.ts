import {Component, Inject} from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import {SnackBar} from "../../models/snackbar";

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackBarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBar,
    public snackBarRef: MatSnackBarRef<SnackBarComponent>) {
  }

  public dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
