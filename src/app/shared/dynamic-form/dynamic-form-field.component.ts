import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicFormField } from './dynamic-form-field';

@Component({
  selector: 'w3s-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html',
  styleUrls: ['./dynamic-form-field.component.scss']
})
export class DynamicFormFieldComponent {

  @Input() form: FormGroup;
  @Input() dynamicFormField: DynamicFormField;

  get isValid() {
    return this.form.controls[this.dynamicFormField.id].valid;
  }
}
