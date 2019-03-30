import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { QuestionBase } from './question-base';
import { DynamicFormGroupService } from './dynamic-form-group.service';

@Component({
  selector: 'w3s-dynamic-form-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.scss']
})
export class DynamicFormQuestionComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() question: QuestionBase;

  constructor(
    private fb: FormBuilder,
    private formGroupService: DynamicFormGroupService) { }

  ngOnInit() {
    if (this.question.isDisabled) {
      this.form.controls[this.question.key].disable();
    }
  }

  /** Get FormArray control(s) */
  getFormArray() {
    return this.form.get(this.question.key) as FormArray;
  }

  /** Add FormGroup to FormArray */
  addFormGroup() {
    // Creating a FormGroup from the given *nested* questions.
    const formGroup = this.formGroupService.createFormGroup(this.question.nestedQuestions);
    // Adding this new FormGroup to the FormArray.
    this.getFormArray().push(formGroup);
  }

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }
}
