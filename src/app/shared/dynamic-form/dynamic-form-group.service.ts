import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DynamicFormField } from './dynamic-form-field';

@Injectable()
export class DynamicFormGroupService {
  constructor() { }

  createFormGroup(dynamicFormFields: DynamicFormField[]) {
    const group: any = {};

    dynamicFormFields.forEach(dynamicFormField => {
      group[dynamicFormField.id] = dynamicFormField.required
        ? new FormControl(dynamicFormField.value || '', Validators.required)
        : new FormControl(dynamicFormField.value || '');
    });
    return new FormGroup(group);
  }
}
