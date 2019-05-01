import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

import { QuestionBase } from './question-base';

@Injectable()
export class DynamicFormGroupService {

  constructor() { }

  /**
   * ##################################################################
   * Creating a FormGroup from the given questions.
   * ##################################################################
   */
  createFormGroup(questions: QuestionBase[]) {
    const group: any = {};

    questions.forEach(question => {

      if (question.controlType === 'formArray') {
        group[question.name] = new FormArray([]);
      } else {

        group[question.name] = question.isRequired
          ? new FormControl(question.defaultValue || '', Validators.required)
          : new FormControl(question.defaultValue || '');
      }
    });

    console.log('############## questions = ' + JSON.stringify(questions));
    console.log('############## group = ' + JSON.stringify(group));

    return new FormGroup(group);
  }

}
