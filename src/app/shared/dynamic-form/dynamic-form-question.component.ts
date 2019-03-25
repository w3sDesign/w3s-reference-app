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

  constructor(private fb: FormBuilder, private formGroupService: DynamicFormGroupService) { }

  ngOnInit() {
    if (this.question.isDisabled) {
      this.form.controls[this.question.key].disable();
    }
  }

  getFormArray() {
    // get the AbstractControl of 'addresses' as AbstractControl[]
    return this.form.get(this.question.key) as FormArray;
  }

  addFormGroup() {
    const formGroup = this.formGroupService.createFormGroup(this.question.nestedQuestions);

    this.getFormArray().push(formGroup);
  }

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }
}
