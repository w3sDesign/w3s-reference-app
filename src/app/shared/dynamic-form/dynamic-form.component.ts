import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from './question-base';
import { DynamicFormGroupService } from './dynamic-form-group.service';

@Component({
  selector: 'w3s-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  providers: [DynamicFormGroupService]
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase[] = [];
  @Input() formClass = {};

  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;

  payLoad = '';

  constructor(private dynamicFormGroupService: DynamicFormGroupService) { }

  ngOnInit() {
    this.form = this.dynamicFormGroupService.createFormGroup(this.questions);
    // this.form.controls['id'].disable();
  }

  onSubmit() {
    // RawValue() includes disabled controls.
    // this.formSubmit.emit(this.form.getRawValue());

    this.formSubmit.emit(this.form.value);

    // this.payLoad = JSON.stringify(this.form.getRawValue());
    this.payLoad = JSON.stringify(this.form.value);
  }

  getFormValue() {
    // return JSON.stringify(this.form.value);

    // RawValue() includes disabled controls.
    return JSON.stringify(this.form.getRawValue());


  }

  setFormValue(value) {
    // this.form.setValue(value);

    // patchValue does its best to match the values
    // to the correct controls in the group.
    this.form.patchValue(value);

  }
}
