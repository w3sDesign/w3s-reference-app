import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../../shared/dynamic-form/question-base';
import { DynamicFormGroupService } from '../../shared/dynamic-form/dynamic-form-group.service';
import { FilterService } from '../model/filter.service';

import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort } from '@angular/material';

@Component({
  selector: 'app-filter-detail',
  templateUrl: './filter-detail.component.html',
  styleUrls: ['./filter-detail.component.scss'],
  providers: [DynamicFormGroupService]
})
export class FilterDetailComponent implements OnInit {

  filterQuestions: QuestionBase[];
  selectFilterQuestions: QuestionBase[];

  rowForm = { rowForm: true };
  columnForm = { columnForm: true };

  // data table
  filters: QuestionBase[] = [];
  selectedFilter = '';
  allColumns = ['key', 'label'];
  displayedColumns = ['select', 'label'];
  selection = new SelectionModel<QuestionBase>(true, []);

  constructor(
    private filterQuestionService: FilterService,
  ) {
    /** Getting the filter fields dynamically. */
    this.filterQuestions = filterQuestionService.getFilters();
    this.selectFilterQuestions = filterQuestionService.getSelectFilters();
    // data table
    this.filters = this.selectFilterQuestions;
  }

  ngOnInit() {
    // this.form = this.formGroupService.createFormGroup(this.filterQuestions);
  }

  onFilterFormSubmit(value) {
    // this.filterFormValue = value;
    // this.loadCustomers();
  }

  /**
   * ##################################################################
   * Helpers data table
   * ##################################################################
   */

  /** Whether number of selected rows matches total number of rows. */
  isAllSelected(): boolean {
    // const numSelected = this.selection.selected.length;
    // const numRows = this.customers.length;
    return this.selection.selected.length === this.filters.length;
  }

  /** Selects all rows if not all selected; otherwise clears selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.filters.forEach(filter => this.selection.select(filter));
  }

  onSelect(row: QuestionBase) {
    this.selectedFilter = JSON.stringify(row);
    // this.selectedFilter = '***********TEST****************';
    // this.router.navigate(['/customers', row.id]);
  }

}

