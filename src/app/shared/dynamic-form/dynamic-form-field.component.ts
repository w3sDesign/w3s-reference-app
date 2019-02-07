import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicFormField } from './dynamic-form-field';

@Component({
  selector: 'w3s-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html'
})
export class DynamicFormFieldComponent {

  @Input() form: FormGroup;
  @Input() dynFormField: DynamicFormField;

  get isValid() {
    return this.form.controls[this.dynFormField.id].valid;
  }
}
