import { Injectable } from '@angular/core';

import { DynamicField } from '../../shared/dynamic-form/dynamic-field';
import { DynamicFieldService } from '../../shared/dynamic-form/dynamic-field.service';


// @Injectable({ providedIn: 'root' })
@Injectable()
export class DynamicFilterFieldService extends DynamicFieldService {

  getFields() {

    const dynamicFilterFields: DynamicField[] = [

      {
        controlType: 'textbox',
        id: 'id', // customer id
        label: 'Filter by Id',
        inputType: 'text',
        order: 2,
        value: 'value2',
      },
      {
        controlType: 'textbox',
        id: 'name', // customer name
        label: 'Filter by Name',
        inputType: 'text',
        order: 3,
        value: 'value3',
      },
      {
        controlType: 'textbox',
        id: 'city',
        label: 'Filter by City',
        inputType: 'text',
        order: 4,
        value: 'value4',
      },
      {
        controlType: 'textbox',
        id: 'email',
        label: 'Filter by Email',
        inputType: 'text',
        order: 10,
        value: 'default',
      },
      {
        controlType: 'dropdown',
        id: 'status',
        label: 'Filter by Status',
        selectOptions: [
          { key: 'solid', value: 'Solid' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
          { key: 'unproven', value: 'Unproven' }
        ],
        order: 11


      }];

    return dynamicFilterFields.sort((a, b) => a.order - b.order);

  }
}
