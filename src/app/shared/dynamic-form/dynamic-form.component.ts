import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from './question-base';
import { DynamicFormGroupService } from './dynamic-form-group.service';
import { DynamicFormOptions } from './dynamic-form-options';

@Component({
  selector: 'w3s-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  // providers: [DynamicFormGroupService]
})
export class DynamicFormComponent implements OnInit {

  showTestValues: true;

  @Input() questions: QuestionBase[];
  @Input() options: DynamicFormOptions = {};
  @Input() dataGroupNames: string[]; // undefined needed for *ngIf
  @Input() title: string;

  @Input() formClass = {}; // curr not used

  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;

  // TODO
  get controls() { return this.questions.filter(({ controlType }) => controlType !== 'button'); }
  get changes() { return this.form.valueChanges; }
  get valid() { return this.form.valid; }
  get value() { return this.form.value; }

  payLoad = '';



  /** Whether form is empty (= all enabled controls are empty). */
  get isEmpty() {

    const obj = this.form.value;
    let empty = true;

    Object.keys(obj).forEach(key => {
      if (obj[key]) { empty = false; }
    });

    return empty;
  }




  /**
   * Note that input properties (like questions and options)
   * are set *after* construction (but before OnInit).
   */
  constructor( // #####################################################

    private formGroupService: DynamicFormGroupService) {

  }

  ngOnInit() { // #####################################################

    // /** Setting data group names. */
    // for (let i = 0; i < 100; i++) {
    //   const idx = this.questions.findIndex(question => question.group === i + 1);
    //   if (idx === -1) { break; }
    //   this.groupNames[i] = this.questions[idx].groupName;
    // }

    //  /** V2 ! Setting data group names. */
    //  for (let i = 0; i < 100; i++) {

    //   const idx = this.questions.map(q => q.group).findIndex(group => group === i + 1);
    //   if (idx === -1) { break; }
    //   this.groupNames[i] = this.questions[idx].groupName;
    // }

    // /** V3 !! = OK  Setting data group names. */

    //   this.groupNames = ['Basic Data', 'Addresses'];


    /**
     * ##################################################################
     * Creating the initial form from the given questions.
     * ##################################################################
     */
    this.form = this.formGroupService.createFormGroup(this.questions);

    // this.form.controls['id'].disable();

  }

  createForm(questions: QuestionBase[]) {
    this.questions = questions;
    this.form = this.formGroupService.createFormGroup(questions);

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
