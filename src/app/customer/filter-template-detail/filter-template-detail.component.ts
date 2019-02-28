import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../../shared/dynamic-form/question-base';
import { DynamicFormGroupService } from '../../shared/dynamic-form/dynamic-form-group.service';
import { FilterTemplateQuestionService } from '../model/filter-template-question.service';

import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort } from '@angular/material';

@Component({
  selector: 'app-filter-template-detail',
  templateUrl: './filter-template-detail.component.html',
  styleUrls: ['./filter-template-detail.component.scss'],
  providers: [DynamicFormGroupService]
})
export class FilterTemplateDetailComponent implements OnInit {

  filterTemplateQuestions: QuestionBase[];

  rowForm = { rowForm: true };
  columnForm = { columnForm: true };



  constructor(
    private questionService: FilterTemplateQuestionService,
  ) {
    /** Getting the filter fields dynamically. */
    this.filterTemplateQuestions = questionService.getFilterTemplateQuestions();
  }

  ngOnInit() {
    // this.form = this.formGroupService.createFormGroup(this.filterQuestions);
  }

  onFormSubmit(value) {
    // this.filterFormValue = value;
    // this.loadCustomers();
  }

  /**
   * ##################################################################
   * Helpers data table
   * ##################################################################
   */



}






