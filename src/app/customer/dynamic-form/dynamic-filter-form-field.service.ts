import { Injectable } from '@angular/core';

import { DynamicFormField } from '../../shared/dynamic-form/dynamic-form-field';
import { DynamicFormFieldService } from '../../shared/dynamic-form/dynamic-form-field-.service';


// @Injectable({ providedIn: 'root' })
@Injectable()
export class DynamicFilterFormFieldService extends DynamicFormFieldService {

  getFields() {

    const dynamicFilterFormFields: DynamicFormField[] = [

      {
        controlType: 'textbox',
        id: 'filterById',
        label: 'Filter by Id',
        inputType: 'text',
        order: 2
      },
      {
        controlType: 'textbox',
        id: 'filterByName',
        label: 'Filter by Name',
        inputType: 'text',
        order: 3
      },
      {
        controlType: 'textbox',
        id: 'filterByCity',
        label: 'Filter by City',
        inputType: 'text',
        order: 4
      },
      {
        controlType: 'textbox',
        id: 'filterByEmail',
        label: 'Filter by Email',
        inputType: 'text',
        order: 10
      },
      {
        controlType: 'dropdown',
        id: 'filterByStatus',
        label: 'Filter by status',
        selectOptions: [
          { key: 'solid', value: 'Solid' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
          { key: 'unproven', value: 'Unproven' }
        ],
        order: 11


      }];

    return dynamicFilterFormFields.sort((a, b) => a.order - b.order);

  }
}
