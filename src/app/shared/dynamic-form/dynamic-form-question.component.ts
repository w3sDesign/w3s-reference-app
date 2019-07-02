import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { QuestionBase } from './question-base';
import { DynamicFormGroupService } from './dynamic-form-group.service';
import { DynamicFormOptions } from './dynamic-form-options';
import { MessageService } from '../message.service';

@Component({
  selector: 'w3s-dynamic-form-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.scss']
})
export class DynamicFormQuestionComponent implements OnInit {

  showTestValues = true;

  @Input() form: FormGroup;
  @Input() question: QuestionBase;
  @Input() options: DynamicFormOptions;
  // options2: DynamicFormOptions;

  get isValid() {
    return this.form.controls[this.question.name].valid;
  }

  // Component constructor.
  // ##################################################################

  constructor(
    private fb: FormBuilder,
    private formGroupService: DynamicFormGroupService,
    private messageService: MessageService,
  ) { }


  // Component lifecycle hook.
  // ##################################################################
  // Called once after creating the component,
  // but before creating child components.

  ngOnInit() {
    this.logMessage(`[ngOnInit()] ########################################`);

    if (this.question.isDisabled) {
      this.form.controls[this.question.name].disable();
    }
  }



  /** Get FormArray control(s) */
  getFormArray() {
    return this.form.get(this.question.name) as FormArray;
  }

  /** Add FormGroup to FormArray */
  addFormGroup() {
    // Creating a FormGroup from the given *nested* questions.
    const formGroup = this.formGroupService.createFormGroup(this.question.nestedQuestions);
    // Adding this new FormGroup to the FormArray.
    this.getFormArray().push(formGroup);
  }


  // ##################################################################
  // Component non public member methods.
  // ##################################################################


  /** Logging message to console. */
  private logMessage(message: string) {
    return this.messageService.logMessage('[dynamic-form-question.component.ts] ' + message);
  }

  /** Showing a user friendly message. */
  private showMessage(message: string) {
    return this.messageService.showMessage('*** ' + message + ' ***');
  }

}
