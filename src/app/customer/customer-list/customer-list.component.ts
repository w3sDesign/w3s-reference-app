import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragStart, CdkDropList, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort, MatTable } from '@angular/material';

import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';

import { Customer } from '../model/customer';
import { CustomerDataSource } from '../model/customer.datasource';

import { DynamicFormGroupService } from '../../shared/dynamic-form/dynamic-form-group.service';
import { QueryParams } from '../../shared/query-params';
import { MessageDialogComponent } from '../../shared/message-dialog/message-dialog.component';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';

import { CustomerDetailDialogComponent } from '../customer-detail/customer-detail.component';

import { MessageSnackBarComponent } from '../../shared/message-snack-bar/message-snack-bar.component';

import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent } from '../../shared/dynamic-form/dynamic-form-question.component';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../../shared/dynamic-form/question-base';
import { mockCustomerQuestions } from '../model/mock-customer-questions';

import { CustomerFilterTemplate } from '../model/customer-filter-template';

import { InputDialogComponent } from '../../shared/input-dialog/input-dialog.component';

import { DynamicFormOptions } from '../../shared/dynamic-form/dynamic-form-options';
import { mockCustomers } from '../model/mock-customers';


import { CustomerService } from '../model/customer.service';
import { HttpCustomerService } from '../model/http-customer.service';
import { FocusMonitor } from '@angular/cdk/a11y';



@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})

/**
 * Main component for customer data entry and management.
 * ####################################################################
 */

export class CustomerListComponent implements OnInit, AfterViewInit {

  showTestValues = true;
  // consoleLogStyle = 'color: blue; font-weight: 500; line-height: 20px;';

  /**
   * The data source object
   * - is responsible for retrieving and emitting the customer objects
   *   the table should display.
   */
  dataSource: CustomerDataSource;

  customers: Customer[] = [];
  selectedCustomer: Customer;

  // customerQuestions: QuestionBase[] = mockCustomerQuestions.slice();

  /** All available columns that can be displayed in the data table . */
  // TODO from questions
  availableColumns: string[] = [
    'select', 'id', 'name', 'type', 'status', 'comment', 'creationDate',
    'country', 'postalCode', 'city', 'street',
    'department', 'person', 'phone', 'email'
  ];

  /** = selected columns!
   * The columns that should be displayed in the data table */
  columnsToDisplay: string[] = [
    'select', 'id', 'name', 'country', 'city', 'phone', 'email'
  ];


  /** Data table paginator */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /** Sorting table columns */
  @ViewChild(MatSort) sort: MatSort;

  // /** Searching in all fields */
  // @ViewChild('searchInput') searchInput: ElementRef;

  /** Selection handling - data table rows. */
  rowSelection = new SelectionModel<Customer>(true, []);


  /** Create/Update/Delete buttons */
  @ViewChild('crudButtons', { read: ViewContainerRef }) crudButtons;


  /** Table for selecting the columns to display. */
  @ViewChild('selectingColumnsTable') selectingColumnsTable: MatTable<string[]>;


  /** Selection handling - columns to display. */
  /** Args: allowMultiSelect, initialSelection */
  columnSelection = new SelectionModel<string>(true, this.columnsToDisplay);


  /** For drag and drop main table columns. */
  previousDragIndex: number;



  // ##################################################################
  // Constructor
  // ##################################################################

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private formGroupService: DynamicFormGroupService,
    private dialog: MatDialog,
    private focusMonitor: FocusMonitor
  ) {

    // this.filterTemplateQuestions = this.generateFilterTemplateQuestions();
  }



  ngAfterViewInit() {

    // if (this.showTestValues) {
    //   console.log('%c########## this.filterTemplateForm.form.value [ngAfterViewInit()] = \n' +
    //     JSON.stringify(this.filterTemplateForm.form.value), 'color: blue');
    // }

    this.focusMonitor.stopMonitoring(document.getElementById('testLink1'));
    this.focusMonitor.stopMonitoring(document.getElementById('test1'));

  }


  // ##################################################################
  // OnInit
  // ##################################################################

  ngOnInit() {

    // Subscribing to sort and page changes.
    // ################################################################
    // Whenever a sort/page change event is emitted, a data load will be triggered.

    this.sort.sortChange
      .subscribe(() => {
        this.getCustomers();
        /** Reset to first page */
        this.paginator.pageIndex = 0;
      });

    this.paginator.page
      .subscribe(() => this.getCustomers());



    // Performing initial data load.
    // ################################################################
    // Delegating data access to the CustomerDataSource object.

    this.dataSource = new CustomerDataSource(this.customerService);

    // const queryParams = new QueryParams();
    // this.dataSource.getCustomers(queryParams);

    // this.getCustomers();

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
   * Setting query parameters and getting customers from dataSource.
   * ##################################################################
   */
  getCustomers(params?: QueryParams) {

    // Test
    // if (this.filterTemplateForm.form.value) {

    // (1) Setting queryParams.
    const queryParams = new QueryParams();

    if (params) {
      queryParams.searchTerm = params.searchTerm;
      queryParams.filter = params.filter;
    }

    // if (this.showTestValues) {
    //   console.log('%c########## queryParams [getCustomers()] = \n' +
    //     JSON.stringify(queryParams), 'color: darkblue');
    // }

    queryParams.sortOrder = this.sort.direction;
    // The id of the column being sorted.
    queryParams.sortField = this.sort.active;
    queryParams.pageNumber = this.paginator.pageIndex;
    queryParams.pageSize = this.paginator.pageSize;

    // (2) Getting customers from dataSource.
    this.dataSource.getCustomers(queryParams);
    /////////////////////////////////////////


    // (3) Update activeFilters.
    // this.activeFilters = [];
    // const obj1 = queryParams.filter; // = this.filterTemplateForm.form.value;
    // for (const key in obj1) {
    //   if (obj1[key]) {
    //     this.activeFilters.push(key);
    //   }
    // }

    // const nr = this.activeFilters.length;
    // this.activeFiltersText = (nr === 0) ? 'Currently no filters active.'
    //   : (nr === 1) ? 'Currently 1 filter active: ' : `Currently ${nr} filters active: `;

    this.rowSelection.clear();

    // }
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








  // ##################################################################
  // Helpers
  // ##################################################################

  /** Whether number of selected rows matches total number of rows. */
  allRowsSelected(): boolean {
    const selected = this.rowSelection.selected.length;
    const all = this.customers.length;
    return selected === all;
  }
  // Selecting the columns to display.
  allColumnsSelected(): boolean {
    const selected = this.columnSelection.selected.length;
    const all = this.availableColumns.length;
    return selected === all;
  }


  /** Selects all rows if not all selected; otherwise clears selection. */
  masterToggle() {
    this.allRowsSelected() ?
      this.rowSelection.clear() :
      this.customers.forEach(customer => this.rowSelection.select(customer));
  }
  // Selecting the columns to display.
  masterToggle2() {
    this.allColumnsSelected() ?
      this.columnSelection.clear() :
      this.availableColumns.forEach(column => this.columnSelection.select(column));
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
  * Navigate to customer detail.
  */
  navigateToCustomerDetail(row: Customer) {
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

  // consoleLog(value: string) {
  //   if (this.showTestValues) {
  //     // console.log('%c##########' + value + ' = ' + eval(message), this.logStyle);

  //     console.log('%c########## ' + value + ' = ', 'color: blue; font-weight: 500;');

  //     // Does not appear in production code.
  //     // tslint:disable-next-line:no-eval
  //     console.log('%c' + eval(value), 'color: blue; font-weight: 400;');
  //   }
  // }


////////////// tests ////////////////
// import {interval} from 'rxjs';
// const numbers = interval(1000);
// numbers.subscribe(x => console.log(x));
///////////////////////////////////////
