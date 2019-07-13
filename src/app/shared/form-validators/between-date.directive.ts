import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';


// https://angular.io/guide/form-validation#custom-validators

// /** A hero's name can't match the given regular expression */
// export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
//   return (control: AbstractControl): {[key: string]: any} | null => {
//     const forbidden = nameRe.test(control.value);
//     return forbidden ? {'forbiddenName': {value: control.value}} : null;
//   };
// }


export function betweenDateValidator(min: Moment, max: Moment): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) { return null; }
    // '[]' = inclusive
    // https://momentjs.com/docs/#/query/is-between/
    const isBetween = control.value.isBetween(min, max, 'day', '[]');
    return isBetween ? null : {
      'betweenDate': {
        value: control.value,
        // message: message
      }
    };
  };
}

// beforeDateValidator, afterDateValidator
