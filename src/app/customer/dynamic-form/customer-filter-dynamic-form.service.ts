import { Injectable } from '@angular/core';

import { DynamicFormField } from '../../shared/dynamic-form/dynamic-form-field';
import { DynamicFormService } from '../../shared/dynamic-form/dynamic-form.service';


// @Injectable({ providedIn: 'root' })
@Injectable()
export class CustomerFilterDynamicFormService extends DynamicFormService {

  getDynamicFormFields() {

    const dynamicFormFields: DynamicFormField[] = [

      {
        controlType: 'textbox',
        id: 'searchInput',
        templateRefVar: '#searchInput',
        label: 'Search in all fields',
        inputType: 'text',
        order: 1
      },
      {
        controlType: 'textbox',
        id: 'id',
        label: 'Filter by Name',
        inputType: 'text',
        order: 2
      },
      {
        controlType: 'textbox',
        id: 'name',
        label: 'Filter by Name',
        inputType: 'text',
        order: 3
      },
      {
        controlType: 'textbox',
        id: 'city',
        label: 'Filter by City',
        inputType: 'text',
        order: 4
      },
      {
        controlType: 'textbox',
        id: 'email',
        label: 'Filter by City',
        inputType: 'text',
        order: 10
      },
      {
        controlType: 'dropdown',
        id: 'brave',
        label: 'Bravery Rating',
        selectOptions: [
          { key: 'solid', value: 'Solid' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
          { key: 'unproven', value: 'Unproven' }
        ],
        order: 11


      }];

    return dynamicFormFields.sort((a, b) => a.order - b.order);

  }
}
