import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicFormField } from './dynamic-form-field';
import { DynamicFormGroupService } from './dynamic-form-group.service';

@Component({
  selector: 'w3s-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  providers: [DynamicFormGroupService]
})
export class DynamicFormComponent implements OnInit {

  @Input() dynamicFormFields: DynamicFormField[] = [];
  @Output() dynamicFormSubmit: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  payLoad = '';

  constructor(private dynamicFormGroupService: DynamicFormGroupService) { }

  ngOnInit() {
    this.form = this.dynamicFormGroupService.createFormGroup(this.dynamicFormFields);
  }

  onSubmit() {
    this.dynamicFormSubmit.emit(this.form.value);
    // this.payLoad = this.form.value;
    this.payLoad = JSON.stringify(this.form.value);
  }
}
