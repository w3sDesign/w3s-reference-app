import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

import { QuestionBase } from './question-base';
import { DynamicFormGroupService } from './dynamic-form-group.service';
import { DynamicFormOptions } from './dynamic-form-options';
import { MessageService } from '../message.service';
import * as moment from 'moment';
import { Moment } from 'moment';

// const moment = _moment;

@Component({
  selector: 'w3s-dynamic-form-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.scss']
})

/**
 * Reusable component for generating a form control dynamically.
 * ####################################################################
 */

export class DynamicFormQuestionComponent implements OnInit {

  // Test// date = new FormControl((new Date()).toISOString());
  // date = new FormControl(new Date());
  // date = new FormControl(moment());

  showTestValues = true;

  @Input() form: FormGroup;
  @Input() question: QuestionBase;
  @Input() options: DynamicFormOptions;
  // options2: DynamicFormOptions;


  // DatepickerFilter
  // for preventing certain dates from being selected from the datepicker.

  // https://material.angular.io/components/datepicker/overview#date-validation
  // https://momentjs.com/docs/#/get-set/year/

  // We must use Moment instead of JS Date!
  // datepickerFilter = (d: Date): boolean => {

  // datepickerFilter = (d: Moment): boolean => {
  //   const currYear = moment().year();
  //   const inputYear = d.year();
  //   return inputYear === currYear;
  // }


  get isValid() {
    return this.form.controls[this.question.name].valid;
  }

  get isInvalid() {
    // return this.form.controls[this.question.name].invalid;
    return this.form.get(this.question.name).invalid;
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



  // ##################################################################
  // Component public member methods (in alphabetical order).
  // ##################################################################


  /** Add FormGroup to FormArray */
  addFormGroup() {
    // Creating a FormGroup from the given *nested* questions.
    const formGroup = this.formGroupService.createFormGroup(this.question.nestedQuestions);
    // Adding this new FormGroup to the FormArray.
    this.getFormArray().push(formGroup);
  }


  // export declare type ValidationErrors = {
  //   [key: string]: any;
  // };

  getErrorMessage() {

    const fc = this.form.controls[this.question.name];


    this.logMessage(
      `[getErrorMessage()] =====================================`
    );

    this.logMessage(
      `[getErrorMessage()] this.question.name = ${this.question.name}`
    );
    // undefined!
    // {"required":"Date required.",
    //  "betweenDate":"Not between 01.01.2000 and 13.07.2019."}
    this.logMessage(
      `[getErrorMessage()] this.question.validationErrors = ${JSON.stringify(this.question.validationErrors)}`
    );
    if (this.question.validationErrors) {
      this.logMessage(
        `[getErrorMessage()] Object.keys(this.question.validationErrors) =
              ${JSON.stringify(Object.keys(this.question.validationErrors))}`
      );
    }

    this.logMessage(
      `[getErrorMessage()] -------------------------------------`
    );
    this.logMessage(
      `[getErrorMessage()] this.form.controls = ${this.form.controls}`
    );
    this.logMessage(
      `[getErrorMessage()] fc.errors = ${JSON.stringify(fc.errors)}`
    );
    if (fc.errors) {
      this.logMessage(
        `[getErrorMessage()] Object.keys(fc.errors) = ${JSON.stringify(Object.keys(fc.errors))}`
      );
    }
    this.logMessage(
      `[getErrorMessage()] fc.errors.required = ${fc.errors.required}`
    );
    this.logMessage(
      `[getErrorMessage()] fc.errors['betweenDate'] = ${fc.errors['betweenDate']}`
    );



    if (this.question.validationErrors) {
      const qErrorCodes: string[] = Object.keys(this.question.validationErrors);
      const fcErrorCodes: string[] = Object.keys(fc.errors);

      for (let i = 0; i < qErrorCodes.length; i++) {
        if (fc.hasError(qErrorCodes[i])) {
          return this.question.validationErrors[qErrorCodes[i]];
        }
      }
    }
    return '';


    // let msg: string;

    // if (fc.hasError('required')) {
    //   msg = 'Value required.';

    // } else if (fc.hasError('email')) {
    //   msg = 'Not a valid email.';

    // } else if (fc.hasError('betweenDate')) {
    //   msg = fc.getError('betweenDate').message;

    // } else {
    //   msg = 'Not a valid value.';
    // }

    // return msg;

  }


  /** Get FormArray control(s) */
  getFormArray() {
    return this.form.get(this.question.name) as FormArray;
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
