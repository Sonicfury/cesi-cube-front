import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';
import {SnackBarComponent} from "../components/snackbar/snackbar.component";
import {SnackBar} from "../models/snackbar";

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {
  }

  error(message = 'Error', duration = 10000): MatSnackBarRef<SnackBarComponent> {
    const data: SnackBar = new SnackBar(message, 'error');
    return this.snackBar.openFromComponent(
      SnackBarComponent,
      {data: data, duration: duration}
    );
  }

  success(message = 'Success', duration = 2500): MatSnackBarRef<SnackBarComponent> {
    const data: SnackBar = new SnackBar(message, 'success');
    return this.snackBar.openFromComponent(
      SnackBarComponent,
      {data: data, duration: duration}
    );
  }

  info(message = 'Info', duration = 5000): MatSnackBarRef<SnackBarComponent> {
    const data: SnackBar = new SnackBar(message, 'info');
    return this.snackBar.openFromComponent(
      SnackBarComponent,
      {data: data, duration: duration}
    );
  }
}
