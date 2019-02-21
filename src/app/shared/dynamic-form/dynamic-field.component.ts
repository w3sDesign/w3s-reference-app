import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicField } from './dynamic-field';

@Component({
  selector: 'w3s-dynamic-field',
  templateUrl: './dynamic-field.component.html',
  styleUrls: ['./dynamic-field.component.scss']
})
export class DynamicFieldComponent {

  @Input() form: FormGroup;
  @Input() dynamicField: DynamicField;

  get isValid() {
    return this.form.controls[this.dynamicField.id].valid;
  }
}
