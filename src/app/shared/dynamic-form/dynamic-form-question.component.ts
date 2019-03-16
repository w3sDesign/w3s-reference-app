import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from './question-base';

@Component({
  selector: 'w3s-dynamic-form-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.scss']
})
export class DynamicFormQuestionComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() question: QuestionBase;

  ngOnInit() {
    if (this.question.isDisabled) {
      this.form.controls[this.question.key].disable();
    }
  }

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }
}
