import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DynamicFormField } from './dynamic-form-field';

@Injectable()
export class DynamicFormControlService {
  constructor() { }

  toFormGroup(dynFormFields: DynamicFormField[]) {
    const group: any = {};

    dynFormFields.forEach(dynFormField => {
      group[dynFormField.id] = dynFormField.required ? new FormControl(dynFormField.value || '', Validators.required)
        : new FormControl(dynFormField.value || '');
    });
    return new FormGroup(group);
  }
}
