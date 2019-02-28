import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from './question-base';

@Component({
  selector: 'w3s-dynamic-form-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.scss']
})
export class DynamicFormQuestionComponent {

  @Input() form: FormGroup;
  @Input() question: QuestionBase;

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }
}
