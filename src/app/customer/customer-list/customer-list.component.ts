/**
 * Initial version based on Metronic 5.5.5.
 */
import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort, MatTable } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragStart, CdkDropList, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
import { mockCustomerQuestions } from '../model/mock-customer-questions';

import { CustomerFilterTemplate } from '../model/customer-filter-template';

import { InputDialogComponent } from '../../shared/input-dialog/input-dialog.component';

import { DynamicFormOptions } from '../../shared/dynamic-form/dynamic-form-options';
import { DynamicFormGroupService } from '../../shared/dynamic-form/dynamic-form-group.service';


// ####################################################################
// CustomerListComponent
// ####################################################################

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})

export class CustomerListComponent implements OnInit {

  showTestValues = true;

  // ##################################################################
  // (1) Filter section related properties.
  // ##################################################################

  /** Available filters != available columns.  */

  // availableFilters: string[] = this.availableColumns;

  /** Filters that are possible. */
  availableFilters: string[] =
    [
      'idFilter', 'nameFilter',
      'typeFilter', 'statusFilter', 'commentFilter', 'creationDateFilter',
      'countryFilter', 'postalCodeFilter', 'cityFilter', 'streetFilter',
      'phoneFilter', 'emailFilter'
    ];

  /** Filters that should be displayed in the filter templates. */
  filtersToDisplay: string[] = [];
    // [
    //   'idFilter', 'nameFilter',
    // ];

  /** Filters that are displayed and have input values. */
  activeFilters: string[] = [];


  /**
   * Reference to the filter template form.
   */
  @ViewChild('filterTemplateForm')
  filterTemplateForm: DynamicFormComponent;

  // filterTemplateFormValue: any = {};
  // filterTemplateForm.form.value used instead!

  filterTemplateFormOptions: DynamicFormOptions = {
    formFieldAppearance: 'standard'
  };

  /**
   * Filter template questions.
   * - Generated from customer questions.
   */
  filterTemplateQuestions: QuestionBase[];

  /** Filter templates */
  filterTemplates: CustomerFilterTemplate[]; // mockCustomerFilterTemplates;

  // selectedFilterTemplate: CustomerFilterTemplate;

  filterTemplateNames: string[] = [];

  selectedFilterTemplateName = 'standard';


  /**
   * Reference to the filter selection.
   */
  @ViewChild('selectingFiltersTable')
  selectingFiltersTable: MatTable<string[]>;


  /** Selection handling. */
  /** Args: allowMultiSelect, initialSelection */
  filterSelection = new SelectionModel<string>(true, this.filtersToDisplay);





  // ##################################################################
  // (2) List section related properties.
  // ##################################################################

  /**
   * The data source object
   * - is responsible for retrieving and emitting the customer objects
   *   the table should display.
   */
  dataSource: CustomerDataSource;

  customers: Customer[] = [];
  selectedCustomer: Customer;

  // customerQuestions: QuestionBase[] = mockCustomerQuestions.slice();

  /** All available columns in the data table. */
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
  rowSelection = new SelectionModel<Customer>(true, []);


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
  // constructor()
  // ##################################################################

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private formGroupService: DynamicFormGroupService,
    private dialog: MatDialog,
  ) {

    this.filterTemplateQuestions = this.generateFilterTemplateQuestions();
  }


  // ##################################################################
  // ngOnInit()
  // ##################################################################

  ngOnInit() {

    // Getting filter templates and performing onSelectFilterTemplate(name).
    // ################################################################

    this.customerService.getCustomerFilterTemplates()
      .subscribe(
        res => {
          this.filterTemplates = res;
          for (let i = 0; i < res.length; i++) {
            this.filterTemplateNames[i] = res[i].name;
          }
          this.selectedFilterTemplateName = 'standard';
          this.onSelectFilterTemplate(this.selectedFilterTemplateName);
        }
      );


    // Subscribing/Listening to keyup events emitted from searchInput when searching in all fields.
    // ################################################################
    // Whenever a 'keyup' event is emitted, a data load will be triggered (getCustomers()).

    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(150), // limiting server requests to one every 150ms
        distinctUntilChanged() // eliminating duplicate values
        // tap(() => {
        //   this.paginator.pageIndex = 0;
        //   this.getCustomers();
        // })
      )
      .subscribe(() => {

        // TODO  onSearchInput:   getCustomers without setting QueryParams!

        this.getCustomers();
        /** Reset to first page */
        this.paginator.pageIndex = 0;
      });


    // Subscribing/Listening to sort/page change events.
    // ################################################################
    // Sorting and paginating the data table.
    // Whenever a sort/page change event is emitted, a data load will be triggered (getCustomers()).

    this.sort.sortChange
      .subscribe(() => {
        this.getCustomers();
        /** Reset to first page */
        this.paginator.pageIndex = 0;
      });

    this.paginator.page
      .subscribe(() => this.getCustomers());


    // Performing initial customer data load.
    // ################################################################
    // Delegating data access to the CustomerDataSource object.

    const queryParams = new QueryParams();
    // queryParams.filter = this.filterConfig(false);
    queryParams.filter = {};

    this.dataSource = new CustomerDataSource(this.customerService);

    this.dataSource.getCustomers(queryParams);

    this.dataSource.customers
      .subscribe(
        res => this.customers = res
      );

    // this.setColumnsToDisplay();

  } // ngOnInit()




  // ####################################################################
  // Methods
  // ####################################################################


  /**
   * Handles selecting a filter.
   * ##################################################################
   * The (change) event is emitted when selecting a filter.
   */
  onSelectFilter() {      // setFiltersToDisplay() {

    // (1) Setting filtersToDisplay from selected filters.
    this.filtersToDisplay = [];
    this.availableFilters.forEach((filter, index) => {
      if (this.filterSelection.isSelected(filter)) {
        this.filtersToDisplay.push(filter);
      }
    });
    // this.selectingFiltersTable.renderRows();//?


    // (2) Generating filterTemplateQuestions.
    this.filterTemplateQuestions = this.generateFilterTemplateQuestions();


    // (3) Generating filterTemplateForm.
    this.generateFilterTemplateForm(this.filterTemplateQuestions);


    // (4) Setting form values and get (search) customers.
    this.renderFilterTemplateForm(this.selectedFilterTemplateName);

  }


  /**
   * Handles selecting a filter template.
   * ##################################################################
   * The (selectionChange) event is emitted by <mat-select> when selecting a filter template.
   *
   * @param name The name of the filter template.
   *
   * For example:
   *  filter template 'standard': [idFilter: '>20010', nameFilter: 'Foundation']
   *  filtersToDisplay: [idFilter, nameFilter]
   */
  onSelectFilterTemplate(name: string) {

    // (1) Setting filtersToDisplay from selected filter template.
    const filterTemplate = this.filterTemplates.find(ft => ft.name === name);
    if (!filterTemplate) { return; }
    //
    this.filtersToDisplay = [];
    Object.keys(filterTemplate).forEach((filterKey) => { // idFilter, nameFilter
      if (filterKey.includes('Filter')) {
        this.filtersToDisplay.push(filterKey);
      }
    });
    console.log('##########onSelectFilterTemplate() / filtersToDisplay = ' + JSON.stringify(this.filtersToDisplay));


    // (2) Generating filterTemplate questions.
    this.filterTemplateQuestions = this.generateFilterTemplateQuestions();
    //
    // tslint:disable-next-line:max-line-length
    console.log('####################onSelectFilterTemplate() / this.filterTemplateQuestions = ' + JSON.stringify(this.filterTemplateQuestions));


    // (3) Generating filterTemplateForm.
    this.generateFilterTemplateForm(this.filterTemplateQuestions);


    // (4) Setting form values and get (search) customers.
    this.renderFilterTemplateForm(name);


    // (5) Setting selected filters.
    this.filterSelection.clear();
    this.filtersToDisplay.forEach(filter => this.filterSelection.select(filter));

    this.selectingFiltersTable.renderRows();

  }


  /**
   * Renders the filter template form.
   * ##################################################################
   *
   * @param name The name of the filter template.
   */
  renderFilterTemplateForm(name: string) {

    const filterTemplate = this.filterTemplates.find(ft => ft.name === name);
    if (!filterTemplate) { return; }

    this.filterTemplateForm.setFormValue(filterTemplate);
    this.getCustomers();

    // new Setting activeFilters
    this.activeFilters = [];
    const obj = this.filterTemplateForm.form.value;
    for (const key in obj) {
      if (obj[key]) { // value   TODO obj.key?
        this.activeFilters.push(key);
      }
    }
  }


  /**
   * Sets which columns to display in the data table.
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


  /**
   * Generates the filter template questions from the customer questions.
   * ##################################################################
   */
  // generateFilterTemplateQuestions(fromQuestions: QuestionBase[]): QuestionBase[] {
  generateFilterTemplateQuestions(): QuestionBase[] {

    const fromQuestions = mockCustomerQuestions.filter(q => {
      return this.filtersToDisplay.includes(q.name + 'Filter');
    });

    // Questions without formArray questions.
    const questions = [];
    fromQuestions.forEach(q => {
      if (q.controlType !== 'formArray') {
        questions.push(q);
      }
    });

    const filterTemplateQuestions = questions.map(q => {

      const newObj = {};

      newObj['name'] = q.name + 'Filter';
      newObj['controlType'] = 'textbox';
      // newObj['inputType'] = 'textarea';
      newObj['inputType'] = 'text';

      newObj['label'] = '';
      newObj['hint'] = 'Filter by ' + q.label;
      newObj['toolTip'] = '';
      // TODO
      if (q.inputType === 'number') {
        newObj['toolTip'] = 'For example: 1000 (equal), <1000 (lower), >1000 (greater), 1000-2000 (between)';
      }

      return newObj;

    });

    console.log('##########generateFilterTemplateQuestions() / this.filtersToDisplay = ' + JSON.stringify(this.filtersToDisplay));
    console.log('##########generateFilterTemplateQuestions() / mockCustomerQuestions = ' + JSON.stringify(mockCustomerQuestions));
    console.log('##########generateFilterTemplateQuestions() / fromQuestions = ' + JSON.stringify(fromQuestions));
    console.log('##########generateFilterTemplateQuestions() / questions = ' + JSON.stringify(questions));
    console.log('##########generateFilterTemplateQuestions() / filterTemplateQuestions = ' + JSON.stringify(filterTemplateQuestions));

    return filterTemplateQuestions as QuestionBase[];
  }


  /**
   * Generates the filter template form.
   * ##################################################################
   */
  generateFilterTemplateForm(questions: QuestionBase[]) {

    // this.filterTemplateForm.form = this.formGroupService.createFormGroup(questions);
    this.filterTemplateForm.createForm(questions);

    // this.getCustomers();
  }


  // /**
  //  * Filter template form commit.
  //  */
  // onFilterTemplateFormSubmit(value) {
  //   this.filterTemplateFormValue = value;
  //   // this.selectedFilterTemplate = value;
  //   this.getCustomers();
  // }


  // searchCustomers() {
  //   this.filterTemplateFormValue = this.filterTemplateForm.form.value;
  //   this.getCustomers();
  // }


  /**
   * Sets the current query parameters and gets (searches) the customers.
   * ##################################################################
   */
  getCustomers() {
    const queryParams = new QueryParams();

    // Setting the current filters from the filter template form
    // queryParams.filter = this.filterTemplateFormValue;
    queryParams.filter = this.filterTemplateForm.form.value;

    queryParams.sortOrder = this.sort.direction;
    // The id of the column being sorted.
    queryParams.sortField = this.sort.active;
    queryParams.pageNumber = this.paginator.pageIndex;
    queryParams.pageSize = this.paginator.pageSize;

    // Delegating to the customer data source.
    this.dataSource.getCustomers(queryParams);

    this.rowSelection.clear();
  }


  // /**
  //  * ##################################################################
  //  * Filter configuration.
  //  * ##################################################################
  //  */
  // filterConfig(isGeneralSearch: boolean = true): any {
  //   const filter: any = {};
  //   const searchText: string = this.searchInput.nativeElement.value;

  //   // if (this.filterByStatus && this.filterByStatus.length > 0) {
  //   //   filter.status = +this.filterByStatus;
  //   // }

  //   // if (this.filterByType && this.filterByType.length > 0) {
  //   //   filter.type = +this.filterByType;
  //   // }

  //   // filter = this.filterForm.value;
  //   // filter.name = this.filterByName ? this.filterByName : searchText;
  //   // filter.country = this.filterByCountry ? this.filterByCountry : searchText;
  //   // filter.postalCode = this.filterByPostalCode ? this.filterByPostalCode : searchText;

  //   // if (!isGeneralSearch) {
  //   //   return filter;
  //   // }

  //   // filter.city = this.filterByCity ? this.filterByCity : searchText;


  //   return filter;
  // }


  // ##################################################################
  // Helpers
  // ##################################################################

  /** Whether number of selected rows matches total number of rows. */
  isAllSelected(): boolean {
    const selected = this.rowSelection.selected.length;
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
      this.rowSelection.clear() :
      this.customers.forEach(customer => this.rowSelection.select(customer));
  }
  // Selecting the columns to display.
  masterToggle2() {
    this.isAllSelected2() ?
      this.columnSelection.clear() :
      this.availableColumns.forEach(column => this.columnSelection.select(column));
  }
  // Selecting the filters to display.
  masterToggle3() {
    this.isAllSelected3() ?
      this.filterSelection.clear() :
      this.availableFilters.forEach(filter => this.filterSelection.select(filter));
  }


  /**
   * Drag and drop table columns
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
      if (this.rowSelection.isEmpty()) {
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
      customer = this.rowSelection.selected[0];
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
    if (this.rowSelection.isEmpty()) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Delete Customers',
          message: `Please select the customer(s) to delete.`,
          showActions: false
        }
      });
      return;
    }

    const numberOfSelections = this.rowSelection.selected.length;
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
            ids.push(this.rowSelection.selected[i].id);
          }

          // Delete identified (selected) customers.
          // ##########################################################
          this.customerService.deleteCustomers(ids)
            .subscribe(
              () => {
                this.getCustomers();
                this.rowSelection.clear();
              },
              // err handled in customerService
            );
        }
      );
  }


}


////////////// tests ////////////////
// import {interval} from 'rxjs';
// const numbers = interval(1000);
// numbers.subscribe(x => console.log(x));
///////////////////////////////////////
