import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DynamicField } from './dynamic-field';

@Injectable()
export class DynamicFormGroupService {
  constructor() { }

  createFormGroup(dynamicFields: DynamicField[]) {
    const group: any = {};

    dynamicFields.forEach(dynamicField => {

      group[dynamicField.id] = dynamicField.required
        ? new FormControl(dynamicField.value || '', Validators.required)
        : new FormControl(dynamicField.value || '');
    });

    return new FormGroup(group);
  }
}
