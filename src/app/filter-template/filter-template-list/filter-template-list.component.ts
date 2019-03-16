import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort } from '@angular/material';

import { fromEvent, merge } from 'rxjs';
//
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { FilterTemplateDataSource } from '../model/filter-template.datasource';
import { MessageDialogComponent } from '../../shared/message-dialog/message-dialog.component';
//
import { FilterTemplate } from '../model/filter-template';
import { QueryParams } from '../../shared/query-params';

import { FilterTemplateService } from '../model/mock-filter-template.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';

import { FilterTemplateDetailDialogComponent } from '../filter-template-detail/filter-template-detail.component';
import { Router } from '@angular/router';

import { MessageSnackBarComponent } from '../../shared/message-snack-bar/message-snack-bar.component';

import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { FormGroup } from '@angular/forms';
import { FilterTemplateQuestionService } from '../model/filter-template-question.service';



////////////// tests ////////////////
// import {interval} from 'rxjs';
// const numbers = interval(1000);
// numbers.subscribe(x => console.log(x));
///////////////////////////////////////

/**
 * ####################################################################
 * FilterTemplateListComponent
 * ####################################################################
 */
@Component({
  selector: 'app-filter-template-list',
  templateUrl: './filter-template-list.component.html',
  styleUrls: ['./filter-template-list.component.scss']
})

export class FilterTemplateListComponent implements OnInit {

  /** Retrieves and emits the filterTemplates to display */
  dataSource: FilterTemplateDataSource;

  filterTemplates: FilterTemplate[] = [];
  selectedFilterTemplate: FilterTemplate;

  columns = [
    'id', 'name', 'type', 'status', 'comment', 'creationDate', 'country', 'postalCode', 'city', 'street', 'phone', 'email'
  ];

  columnsToDisplay = [
    'select', 'id', 'name', 'country', 'postalCode', 'city', 'phone', 'email'
  ];

  // Paging
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  // Sorting
  @ViewChild(MatSort)
  sort: MatSort;

  // Filters
  @ViewChild('searchInput')
  searchInput: ElementRef;


  filterFormValue: any = {};




  @ViewChild('crudButtons', { read: ViewContainerRef })
  crudButtons;

  selection = new SelectionModel<FilterTemplate>(true, []);
  //

  filterTemplateQuestions: any[];



  // Injecting services.
  // #################################################
  constructor(
    private router: Router,
    private filterTemplateService: FilterTemplateService,
    // private httpErrorHandler: HttpErrorHandler,
    private dialog: MatDialog,

    // filterQuestionService: FilterService,
    filterQuestionService: FilterTemplateQuestionService,
  ) {
    this.filterTemplateQuestions = filterQuestionService.getQuestions();
  }


  ngOnInit() {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange
      .subscribe(
        () => this.paginator.pageIndex = 0
      );

    /**
     * Data load will be triggered in two cases:
     * a pagination event occurs (this.paginator.page)
     * a sort event occurs (this.sort.sortChange).
     */
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadFilterTemplates())
      )
      .subscribe();

    // // Filtration, bind to searchInput element
    // fromEvent(this.searchInput.nativeElement, 'keyup')
    //   .pipe(
    //     debounceTime(150), // limiting server requests to one every 150ms
    //     distinctUntilChanged(), // eliminating duplicate values
    //     tap(() => {
    //       this.paginator.pageIndex = 0;
    //       this.loadFilterTemplates();
    //     })
    //   )
    //   .subscribe();


    // Init DataSource
    const queryParams = new QueryParams();
    queryParams.filter = this.filterConfig(false);

    // Initial data load.
    // ########################################
    this.dataSource = new FilterTemplateDataSource(this.filterTemplateService);
    this.dataSource.loadFilterTemplates(queryParams);

    this.dataSource.filterTemplates
      .subscribe(
        res => this.filterTemplates = res
      );
  }


  /**
   * ##################################################################
   * Load filterTemplates.
   * ##################################################################
   */
  onDynamicFilterFormSubmit(value) {
    this.filterFormValue = value;
    this.loadFilterTemplates();
  }

  loadFilterTemplates() {

    const queryParams = new QueryParams();

    /** Setting filters based on search criteria */
    // queryParams.filter = this.filterConfig(true);
    queryParams.filter = this.filterFormValue;

    queryParams.sortOrder = this.sort.direction;
    queryParams.sortField = this.sort.active; /** The id of the column being sorted. */
    queryParams.pageNumber = this.paginator.pageIndex;
    queryParams.pageSize = this.paginator.pageSize;

    /** Delegating to filterTemplate data source.
     * #######################################
     */
    this.dataSource.loadFilterTemplates(queryParams);

    this.selection.clear();
  }

  /**
   * ##################################################################
   * Filter configuration.
   * ##################################################################
   */
  filterConfig(isGeneralSearch: boolean = true): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;

    // if (this.filterByStatus && this.filterByStatus.length > 0) {
    //   filter.status = +this.filterByStatus;
    // }

    // if (this.filterByType && this.filterByType.length > 0) {
    //   filter.type = +this.filterByType;
    // }

    // filter = this.filterForm.value;
    // filter.name = this.filterByName ? this.filterByName : searchText;
    // filter.country = this.filterByCountry ? this.filterByCountry : searchText;
    // filter.postalCode = this.filterByPostalCode ? this.filterByPostalCode : searchText;

    // if (!isGeneralSearch) {
    //   return filter;
    // }

    // filter.city = this.filterByCity ? this.filterByCity : searchText;


    return filter;
  }


  /**
   * ##################################################################
   * Helpers
   * ##################################################################
   */

  /** Whether number of selected rows matches total number of rows. */
  isAllSelected(): boolean {
    // const numSelected = this.selection.selected.length;
    // const numRows = this.filterTemplates.length;
    return this.selection.selected.length === this.filterTemplates.length;
  }

  /** Selects all rows if not all selected; otherwise clears selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.filterTemplates.forEach(filterTemplate =>
        this.selection.select(filterTemplate)
      );
  }





  /**
   * ##################################################################
   * Create a filterTemplate (by updating a new filterTemplate).
   * ##################################################################
   */
  createFilterTemplate() {
    // Create a new filterTemplate with defaults.
    const filterTemplate = new FilterTemplate();
    // Update the filterTemplate.
    this.updateFilterTemplate(filterTemplate);
  }


  /**
   * ##################################################################
   * Update selected filterTemplates (by opening a modal dialog.
   * TODO: multiple selections
   * ##################################################################
   */
  updateFilterTemplate(filterTemplate?: FilterTemplate) {
    if (!filterTemplate) {
      if (this.selection.isEmpty()) {
        this.dialog.open(MessageDialogComponent, {
          data: {
            title: 'Update Selected FilterTemplates',
            message:
              'Please select the filterTemplates to update.',
            showActions: false
          }
        });
        return;
      }
      filterTemplate = this.selection.selected[0];
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = "auto"; 800px
    // dialogConfig.minHeight = "auto"; 200px
    // dialogConfig.maxHeight = "auto"; 800px
    dialogConfig.panelClass = 'w3s-dialog-panel'; // in global styles.scss
    dialogConfig.data = { filterTemplate };

    // Open modal dialog and load FilterTemplateDetailDialogComponent.
    // #########################################################
    const dialogRef = this.dialog.open(FilterTemplateDetailDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(
        res => {
          if (!res) { return; }
          this.loadFilterTemplates();
        }
      );
  }


  /**
   * Navigate to filterTemplate detail.
   */
  onSelect(row: FilterTemplate) {
    this.selectedFilterTemplate = row;
    this.router.navigate(['/filter-templates', row.id]);
  }


  /**
   * ##################################################################
   * Delete selected filterTemplate(s).
   * ##################################################################
   */
  deleteFilterTemplates() {
    if (this.selection.isEmpty()) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Delete FilterTemplates',
          message: `Please select the filterTemplate(s) to delete.`,
          showActions: false
        }
      });
      return;
    }

    const numberOfSelections = this.selection.selected.length;
    const filterTemplate_s = numberOfSelections <= 1 ? 'filterTemplate' : `${numberOfSelections} filterTemplates`;

    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        title: 'Delete FilterTemplates',
        message: `Are you sure to permanently delete the selected ${filterTemplate_s}?`,
        showActions: true
      }
    });

    dialogRef.afterClosed()
      .subscribe(
        ok => {
          if (!ok) { return; }

          // Start deleting. Identify selected filterTemplates.
          const ids: number[] = [];
          for (let i = 0; i < numberOfSelections; i++) {
            ids.push(this.selection.selected[i].templateId);
          }

          // Delete identified (selected) filterTemplates.
          // #######################################
          this.filterTemplateService.deleteFilterTemplates(ids)
            .subscribe(
              () => {
                this.loadFilterTemplates();
                this.selection.clear();
              },
              // err handled in filterTemplateService
            );
        }
      );
  }


}
