/**
 * Initial version based on Metronic 5.5.5.
 */
import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort, MatTable } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { fromEvent, merge, Observable } from 'rxjs';
//
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { CustomerDataSource } from '../model/customer.datasource';
import { MessageDialogComponent } from '../../shared/message-dialog/message-dialog.component';
//
import { Customer } from '../model/customer';
import { QueryParams } from '../../shared/query-params';

import { CustomerService } from '../model/http-customer.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';

import { CustomerDetailDialogComponent } from '../customer-detail/customer-detail.component';
import { Router } from '@angular/router';

import { MessageSnackBarComponent } from '../../shared/message-snack-bar/message-snack-bar.component';

import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent } from '../../shared/dynamic-form/dynamic-form-question.component';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../../shared/dynamic-form/question-base';
// TODO mockCustomerQuestions = mockCustomerFilterTemplateQuestions
import { mockCustomerQuestions } from '../model/mock-customer-questions';
import { mockCustomerFilterTemplateQuestions } from '../model/mock-customer-filter-template-questions';

import { CustomerFilterTemplate } from '../model/customer-filter-template';
import { mockCustomerFilterTemplates } from '../model/mock-customer-filter-templates';

import { InputDialogComponent } from '../../shared/input-dialog/input-dialog.component';

import { CdkDragStart, CdkDropList, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DynamicFormOptions } from '../../shared/dynamic-form/dynamic-form-options';
import { DynamicFormGroupService } from '../../shared/dynamic-form/dynamic-form-group.service';



////////////// tests ////////////////
// import {interval} from 'rxjs';
// const numbers = interval(1000);
// numbers.subscribe(x => console.log(x));
///////////////////////////////////////

// ####################################################################
// CustomerListComponent
// ####################################################################

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})

export class CustomerListComponent implements OnInit {

  showTestValues = false;

  // ##################################################################
  // Filter related properties.
  // ##################################################################

  /** ? All available filters that can be displayed.  */
  availableFilters: string[] = [
    'select', 'id', 'name', 'type', 'status', 'comment', 'creationDate', 'country', 'postalCode', 'city', 'street', 'phone', 'email'
  ];

  /** ? The filters that should be displayed */
  filtersToDisplay: string[] = [
    'select', 'id', 'name', 'country', 'postalCode', 'city', 'phone', 'email'
  ];



  /** Filter template dynamic form component */
  @ViewChild('filterTemplateForm')
  filterTemplateForm: DynamicFormComponent;

  /**
   * Questions for generating the dynamic filter template form:
   * <w3s-dynamic-form [questions]="filterTemplateQuestions" ...
   * Questions are not loaded from server!
   * Used from mock-customer-questions
   */
  // filterTemplateQuestions: QuestionBase[] = mockCustomerFilterTemplateQuestions;
  filterTemplateQuestions: QuestionBase[]; // = mockCustomerQuestions;



  /** Filter templates */
  filterTemplates: CustomerFilterTemplate[]; // mockCustomerFilterTemplates;

  // selectedFilterTemplate: CustomerFilterTemplate;

  filterTemplateNames: string[] = [];

  selectedFilterTemplateName = 'standard';

  filterTemplateFormValue: any = {};

  filterTemplateFormOptions: DynamicFormOptions = {
    formFieldAppearance: 'standard'
  };


  /** Table for selecting the filters to display. */
  @ViewChild('selectingColumnsTable')
  selectingFiltersTable: MatTable<string[]>;

  /** Selection handling - filters to display. */
  /** Args: allowMultiSelect, initialSelection */
  filterSelection = new SelectionModel<string>(true, this.filtersToDisplay);



  // ##################################################################
  // List (data table) related properties.
  // ##################################################################

  /** The data source object is responsible for retrieving and emitting the customers to display. */
  dataSource: CustomerDataSource;

  customers: Customer[] = [];
  selectedCustomer: Customer;


  /** All available columns in the data table.  */
  // TODO from questions
  availableColumns: string[] = [
    'select', 'id', 'name', 'type', 'status', 'comment', 'creationDate', 'country', 'postalCode', 'city', 'street', 'phone', 'email'
  ];

  /** The columns that should be displayed */
  columnsToDisplay: string[] = [
    'select', 'id', 'name', 'country', 'postalCode', 'city', 'phone', 'email'
  ];


  /** Data table paginator */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Sorting table columns */
  @ViewChild(MatSort)
  sort: MatSort;

  /** Searching in all fields */
  @ViewChild('searchInput')
  searchInput: ElementRef;

  /** Selection handling - data table rows. */
  selection = new SelectionModel<Customer>(true, []);


  /** Create/Update/Delete buttons */
  @ViewChild('crudButtons', { read: ViewContainerRef })
  crudButtons;


  /** Table for selecting the columns to display. */
  @ViewChild('selectingColumnsTable')
  selectingColumnsTable: MatTable<string[]>;


  /** Selection handling - columns to display. */
  /** Args: allowMultiSelect, initialSelection */
  columnSelection = new SelectionModel<string>(true, this.columnsToDisplay);



  /** For drag and drop main table columns. */
  previousDragIndex: number;


  // ##################################################################

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private formGroupService: DynamicFormGroupService,
    private dialog: MatDialog,
  ) {

    /** Generate filter template questions from customer questions. */
    this.filterTemplateQuestions = this.generateFilterTemplateQuestions(mockCustomerQuestions);



  }


  // ##################################################################

  ngOnInit() {

    /** Filter templates:
     *  Getting the filter templates (from customer service), and
     *  initialize/render the standard filter template form. */
    // ################################################################

    this.customerService.getCustomerFilterTemplates()
      .subscribe(
        res => {
          this.filterTemplates = res;
          for (let i = 0; i < res.length; i++) {
            this.filterTemplateNames[i] = res[i].name;
          }

          this.selectedFilterTemplateName = 'standard';

          /** Render the filter template form */
          this.renderFilterTemplateForm(this.selectedFilterTemplateName);

          // console.log(this.filterTemplateNames);
        }
      );





    /** Searching in all fields.
     *  Subscribing to the keyup event.
     *  Whenever a 'keyup' event is emitted,
     *  a data load will be triggered (getCustomers()). */
    // ################################################################

    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(150), // limiting server requests to one every 150ms
        distinctUntilChanged(), // eliminating duplicate values
        tap(() => {
          this.paginator.pageIndex = 0;
          this.getCustomers();
        })
      )
      .subscribe();



    /** Table sorting and paginating.
     *  Subscribing to the sortChange and page EventEmitter.
     *  Whenever a table sort/page change event is emitted,
     *  a data load will be triggered (getCustomers()). */
    // ################################################################

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.getCustomers())
      )
      .subscribe();



    /** If the user changes the sort order, reset back to the first page. */
    // ################################################################

    this.sort.sortChange
      .subscribe(
        () => this.paginator.pageIndex = 0
      );


    /** Initial data load */
    // ################################################################

    const queryParams = new QueryParams();
    queryParams.filter = this.filterConfig(false);

    this.dataSource = new CustomerDataSource(this.customerService);

    this.dataSource.getCustomers(queryParams);

    this.dataSource.customers
      .subscribe(
        res => this.customers = res
      );


    // this.setColumnsToDisplay();


  } // The end of ngOnInit() ##########################################





  /**
   * generateFilterTemplateQuestions()
   * ##################################################################
   * from the source questions (eg. customerQuestions)
   */
  generateFilterTemplateQuestions(fromQuestions: QuestionBase[]): QuestionBase[] {
    const filterTemplateQuestions: QuestionBase[] = fromQuestions; // eg. mockCustomerQuestions

    filterTemplateQuestions.forEach((q, i) => {
      q.name = q.name + 'Filter'; // add 'Filter' to the name
      if (q.controlType === 'formArray') {
        filterTemplateQuestions.splice(i, 1); // remove this question
      } else {
        q.controlType = 'textbox';
      }
      if (q.group) { q.group = 0; } // no dataGroups
      if (q.groupName) { q.groupName = ''; }
      if (q.isRequired) { q.isRequired = false; }
      if (q.isReadonly) { q.isReadonly = false; }

      q.hint = 'Filter by ' + q.label;
      q.label = '';

      if (q.inputType === 'number') {
        q.tooltip = 'For example: 1000 (equal), <1000 (lower), >1000 (greater), 1000-2000 (between)';
      }
      q.inputType = 'textarea';

    });

    return filterTemplateQuestions;
  }

  /**
   * generateFilterTemplateForm()
   * ##################################################################
   * Generate the filter template form.
   */
  generateFilterTemplateForm(questions: QuestionBase[]) {

    this.filterTemplateForm.form = this.formGroupService.createFormGroup(questions);

    this.getCustomers();
  }



  /**
   * renderFilterTemplateForm
   * ##################################################################
   * Render the filter template form.
   */
  renderFilterTemplateForm(name: string) {

    const arr = this.filterTemplates.filter(template => template.name === name);
    // if (!arr) 'standard or error TODO
    const filterTemplate = arr[0];

    this.filterTemplateForm.setFormValue(filterTemplate);
    this.getCustomers();
  }




  /**
   * Filter template form commit.
   */
  onFilterTemplateFormSubmit(value) {
    this.filterTemplateFormValue = value;
    // this.selectedFilterTemplate = value;
    this.getCustomers();
  }


  searchCustomers() {
    this.filterTemplateFormValue = this.filterTemplateForm.form.value;
    this.getCustomers();

  }

  /**
   * Filter template form commit.
   */
  // searchCustomers(filterTemplate: CustomerFilterTemplate) {
  //   // this.filterTemplateFormValue = filterTemplate;
  //   this.selectedFilterTemplate = filterTemplate;
  //   this.getCustomers();
  // }



  /**
     * ##################################################################
     * Load customers.
     * ##################################################################
     */
  getCustomers() {

    const queryParams = new QueryParams();

    /** Setting current filters from filter template form */
    // ==================================================
    // queryParams.filter = this.selectedFilterTemplate;
    // queryParams.filter = this.filterTemplateFormValue;
    queryParams.filter = this.filterTemplateForm.form.value;

    queryParams.sortOrder = this.sort.direction;
    queryParams.sortField = this.sort.active; /** The id of the column being sorted. */
    queryParams.pageNumber = this.paginator.pageIndex;
    queryParams.pageSize = this.paginator.pageSize;

    /** Delegating to customer data source.
     * #######################################
     */
    this.dataSource.getCustomers(queryParams);

    this.selection.clear();
  }



  /**
   * ##################################################################
   * Setting columns to display.
   * ##################################################################
   */

  setColumnsToDisplay() {
    this.columnsToDisplay = [];
    this.availableColumns.forEach((column, index) => {
      if (this.columnSelection.isSelected(column)) {
        this.columnsToDisplay.push(column);
      }
    });
    this.selectingColumnsTable.renderRows();
  }


  setFiltersToDisplay() {
    // TODO ? it's not a table, it's a dyn. form
  }



  // setDisplayedColumns() {
  //   let i = 0;
  //   this.availableColumns.forEach((column, index) => {
  //     // column.index = index;
  //     if (this.columnSelection.isSelected(column)) {
  //       // this.columnsToDisplay[index] = column;
  //       this.columnsToDisplay[i] = column;
  //       i++;
  //     }
  //   });
  // }






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
    const selected = this.selection.selected.length;
    const all = this.customers.length;
    return selected === all;
  }
  // Selecting the columns to display.
  isAllSelected2(): boolean {
    const selected = this.columnSelection.selected.length;
    const all = this.availableColumns.length;
    return selected === all;
  }
  // Selecting the filters to display.
  isAllSelected3(): boolean {
    const selected = this.filterSelection.selected.length;
    const all = this.availableFilters.length;
    return selected === all;
  }

  /** Selects all rows if not all selected; otherwise clears selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.customers.forEach(customer => this.selection.select(customer));
  }
  // Selecting the columns to display.
  masterToggle2() {
    this.isAllSelected2() ?
      this.columnSelection.clear() :
      this.availableColumns.forEach(column => this.columnSelection.select(column));
  }
  // Selecting the columns to display.
  masterToggle3() {
    this.isAllSelected3() ?
      this.filterSelection.clear() :
      this.availableFilters.forEach(filter => this.filterSelection.select(filter));
  }


  /**
     * ##################################################################
     * Drag and drop table columns.
     * ##################################################################
     */

  dragStarted(event: CdkDragStart, index: number) {
    this.previousDragIndex = index;
  }

  dropListDropped(event: CdkDropList, index: number) {
    if (event) {
      moveItemInArray(this.availableColumns, this.previousDragIndex, index);
      this.setColumnsToDisplay();
    }
  }

  // drop(event: CdkDragDrop<Customer[]>) {
  //   moveItemInArray(this.customers, event.previousDragIndex, event.currentIndex);
  // }
  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.availableColumns, event.previousDragIndex, event.currentIndex);
  // }




  /**
   * ##################################################################
   * Create a customer (by updating a new customer).
   * ##################################################################
   */
  createCustomer() {
    // Create a new customer with defaults.
    const customer = new Customer();
    // Update the customer.
    this.updateCustomer(customer);
  }


  /**
   * ##################################################################
   * Create a filter template.
   * ##################################################################
   */
  createFilterTemplate(filterTemplate: CustomerFilterTemplate) {

    const dialogRef = this.dialog.open(InputDialogComponent, {
      data: {
        title: 'Save as',
        message: `Please enter the filter template name`,
        name: '',
      }
    });

    dialogRef.afterClosed()
      .subscribe(
        name => {
          if (!name) { return; }

          filterTemplate.name = name;
          filterTemplate.id = null;

          /** Delegating to customer service */
          this.customerService.createCustomerFilterTemplate(filterTemplate)
            .subscribe(
              () => {
                this.customerService.getCustomerFilterTemplates()
                  .subscribe(
                    (res) => {
                      this.filterTemplates = res;
                      // console.log('#######this.filterTemplates = ' + JSON.stringify(this.filterTemplates));

                      this.filterTemplateNames = [];
                      for (let i = 0; i < res.length; i++) {
                        this.filterTemplateNames[i] = res[i].name;
                      }

                      this.selectedFilterTemplateName = filterTemplate.name;

                      this.renderFilterTemplateForm(this.selectedFilterTemplateName);


                      // Also update the in memory filter templates (this.filterTemplates)
                      // and filter template names.
                      // TODO
                      // const idx = this.filterTemplates.findIndex(element => element.id === filterTemplate.id);
                      // this.filterTemplates[idx] = filterTemplate;
                    },
                    // err handled in customerService
                  );
              }
            );
        }
      );

  }







  /**
   * ##################################################################
   * Update selected customers (by opening a modal dialog.
   * TODO: multiple selections
   * ##################################################################
   */
  updateCustomer(customer?: Customer) {
    if (!customer) {
      if (this.selection.isEmpty()) {
        this.dialog.open(MessageDialogComponent, {
          data: {
            title: 'Update Selected Customers',
            message:
              'Please select the customers to update.',
            showActions: false
          }
        });
        return;
      }
      customer = this.selection.selected[0];
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = "auto"; 800px
    // dialogConfig.minHeight = "auto"; 200px
    // dialogConfig.maxHeight = "auto"; 800px
    dialogConfig.panelClass = 'w3s-dialog-panel'; // in global styles.scss
    dialogConfig.data = { customer };

    // Open modal dialog and load CustomerDetailDialogComponent.
    // ################################################################
    const dialogRef = this.dialog.open(CustomerDetailDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(
        res => {
          if (!res) { return; }
          this.getCustomers();
        }
      );
  }


  /**
   * ##################################################################
   * Update a filter template.
   * ##################################################################
   */
  updateFilterTemplate(filterTemplate: CustomerFilterTemplate) {
    this.customerService.updateCustomerFilterTemplate(filterTemplate)
      .subscribe(
        () => {
          // Also update the in memory filter templates (this.filterTemplates).
          const idx = this.filterTemplates.findIndex(element => element.id === filterTemplate.id);
          this.filterTemplates[idx] = filterTemplate;
        },
        // err handled in customerService
      );
  }







  /**
  * Navigate to customer detail.
  */
  goToCustomerDetail(row: Customer) {
    this.selectedCustomer = row;
    this.router.navigate(['/customers', row.id]);
  }


  /**
   * ##################################################################
   * Delete selected customer(s).
   * ##################################################################
   */
  deleteCustomers() {
    if (this.selection.isEmpty()) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Delete Customers',
          message: `Please select the customer(s) to delete.`,
          showActions: false
        }
      });
      return;
    }

    const numberOfSelections = this.selection.selected.length;
    const customer_s = numberOfSelections <= 1 ? 'customer' : `${numberOfSelections} customers`;

    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        title: 'Delete Customers',
        message: `Are you sure to permanently delete the selected ${customer_s}?`,
        showActions: true
      }
    });

    dialogRef.afterClosed()
      .subscribe(
        ok => {
          if (!ok) { return; }

          // Start deleting. Identify selected customers.
          const ids: number[] = [];
          for (let i = 0; i < numberOfSelections; i++) {
            ids.push(this.selection.selected[i].id);
          }

          // Delete identified (selected) customers.
          // ##########################################################
          this.customerService.deleteCustomers(ids)
            .subscribe(
              () => {
                this.getCustomers();
                this.selection.clear();
              },
              // err handled in customerService
            );
        }
      );
  }


}
