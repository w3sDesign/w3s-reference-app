import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionBase } from './question-base';

@Injectable()
export class DynamicFormGroupService {
  constructor() { }

  createFormGroup(questions: QuestionBase[]) {
    const group: any = {};

    questions.forEach(question => {

      group[question.key] = question.required
        ? new FormControl(question.value || '', Validators.required)
        : new FormControl(question.value || '');
    });

    return new FormGroup(group);
  }
}
