import { Pipe, PipeTransform } from '@angular/core';

/*
 * Displaying date in the current locale.
*/
@Pipe({name: 'firstLetterCase'})
export class FirstLetterCasePipe implements PipeTransform {
  transform(input: string): string {
    return input.length === 0 ? '' :
    input.replace(/\w\S*/g, (match => match[0].toUpperCase() + match.substring(1) ));
  }
}
