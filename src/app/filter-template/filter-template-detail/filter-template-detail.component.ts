import { Component, Input, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../../shared/dynamic-form/question-base';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { DynamicFormGroupService } from '../../shared/dynamic-form/dynamic-form-group.service';
import { FilterTemplateQuestionService } from '../model/filter-template-question.service';

import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FilterTemplate } from '../model/filter-template';

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
    this.filterTemplateQuestions = questionService.getQuestions();
  }

  ngOnInit() {
    // this.form = this.formGroupService.createFormGroup(this.filterQuestions);
  }

  onFormSubmit(value) {
    // this.filterFormValue = value;
    // this.loadFilterTemplates();
  }



}





/**
 * Called from FilterTemplateListComponent via:
 * dialog.open(FilterTemplateDetailDialogComponent, dialogConfig);
 * and dialogConfig.data = { filterTemplate }
 */
export class FilterTemplateDetailDialogComponent extends FilterTemplateDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FilterTemplateDetailDialogComponent>,
    // data object from open.dialog(): data = { filterTemplate }
    @Inject(MAT_DIALOG_DATA) public data: any,

    // formBuilder: FormBuilder,
questionService: FilterTemplateQuestionService,
    // router: Router,
    // route: ActivatedRoute,
    // filterTemplateService: FilterTemplateService,
    // httpErrorHandler: HttpErrorHandler,
    // typesUtilsService: TypesUtilsService
  ) {
    // super(formBuilder, router, route, filterTemplateService, httpErrorHandler, typesUtilsService);
    super(questionService);
    // this.isDialogComponent = true;
  }

  ngOnInit() {
    // this.filterTemplate = this.data.filterTemplate;
    // this.buildForm();
  }

  returnToList(filterTemplate?: FilterTemplate) {
    this.dialogRef.close({
      filterTemplate,
      isEdit: true
    });

  }
}

