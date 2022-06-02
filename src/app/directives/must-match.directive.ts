import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function mustMatch(matchControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = control.value !== matchControl.value;
    return forbidden ? {forbiddenName: {value: 'password'}} : null;
  };
}
