import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicFormField } from './dynamic-form-field';
import { DynamicFormControlService } from './dynamic-form-control.service';

@Component({
  selector: 'w3s-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [DynamicFormControlService]
})
export class DynamicFormComponent implements OnInit {

  @Input() dynFormFields: DynamicFormField[] = [];
  form: FormGroup;
  payLoad = '';

  constructor(private dynFormControlService: DynamicFormControlService) { }

  ngOnInit() {
    this.form = this.dynFormControlService.toFormGroup(this.dynFormFields);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }
}
