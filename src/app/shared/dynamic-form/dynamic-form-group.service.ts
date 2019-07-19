import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

import { QuestionBase } from './question-base';

import * as moment from 'moment';
import { betweenDateValidator } from '../form-validators/between-date.directive';



/**
 * Service for creating a form group.
 * ####################################################################
 */

@Injectable()
export class DynamicFormGroupService {

  constructor() { }


  /**
   * Creating a FormGroup from the given questions.
   * ##################################################################
   * Must correspond to dynamic-form-question.component.html
   */

  createFormGroup(questions: QuestionBase[]) {
    const group: any = {};

    questions.forEach(question => {

      if (question.controlType === 'textbox') {

        if (question.inputType === 'date') {



          group[question.name] = new FormControl(
            { value: moment(), disabled: question.isDisabled },
            // Validators array from question.
            question.validators
          );


        } else if (question.inputType === 'email') {

          //  https://material.angular.io/components/form-field/examples

          group[question.name] = new FormControl(
            { value: question.defaultValue, disabled: question.isDisabled },
            question.validators
          );
           // group[question.name] = question.isRequired
          //   ? new FormControl({ value: question.defaultValue, disabled: question.isDisabled }, [Validators.required, Validators.email])
          //   : new FormControl({ value: question.defaultValue, disabled: question.isDisabled }, Validators.email);

        } else {

          // All other inputTypes.

          group[question.name] = new FormControl(
            { value: question.defaultValue, disabled: question.isDisabled },
            question.validators ? question.validators : []
          );
          // group[question.name] = question.isRequired
          //   ? new FormControl({ value: question.defaultValue, disabled: question.isDisabled }, Validators.required)
          //   : new FormControl({ value: question.defaultValue, disabled: question.isDisabled });

        }


      } else if (question.controlType === 'formArray') {

        group[question.name] = new FormArray([]);


      } else {

        // All other controlTypes.

        group[question.name] = new FormControl(
          { value: question.defaultValue, disabled: question.isDisabled },
          question.validators ? question.validators : []
        );
        // group[question.name] = question.isRequired
        //   ? new FormControl({ value: question.defaultValue, disabled: question.isDisabled }, Validators.required)
        //   : new FormControl({ value: question.defaultValue, disabled: question.isDisabled });

      }

    });

    // console.log('########### questions = ' + JSON.stringify(questions));
    // console.log('########### group = ' + JSON.stringify(group));

    // const form = new FormGroup({
    //   id: new FormControl(''),
    //   name: new FormControl(''),
    //   idFilter: new FormControl(''),
    //   idName: new FormControl(''),
    //   // ...
    // });

    const form = new FormGroup(group);

    // form.reset({
    //   id: { disabled: true },
    //   name: { disabled: true }
    // });

    return form;
  }

}
