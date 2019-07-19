import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

/*
 * Displaying date in the current locale.
 * See also customer-detail.
*/
@Pipe({name: 'momentDatePipe'})
export class MomentDatePipe implements PipeTransform {
  transform(value: string, format?: string): string {
    return moment(value, ['YYYY-MM-DD', 'DD/MM/YYYY']).format('L');
  }
}
