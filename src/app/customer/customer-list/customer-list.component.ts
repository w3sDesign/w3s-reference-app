/**
 * Initial version based on Metronic 5.5.5.
 */
import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort } from '@angular/material';

import { fromEvent, merge } from 'rxjs';
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
import { FilterService } from '../model/filter.service';
import { FormGroup } from '@angular/forms';



////////////// tests ////////////////
// import {interval} from 'rxjs';
// const numbers = interval(1000);
// numbers.subscribe(x => console.log(x));
///////////////////////////////////////

/**
 * ####################################################################
 * CustomerListComponent
 * ####################################################################
 */
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  /** Retrieves and emits the customers to display */
  dataSource: CustomerDataSource;

  customers: Customer[] = [];
  selectedCustomer: Customer;

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

  // filterByStatus = '';
  // filterByType = '';

  filterFormValue: any = {};


  // filterById: number;
  // filterByName = '';

  // filterByCountry = '';
  // filterByPostalCode = '';
  // filterByCity = '';
  // filterByStreet = '';

  @ViewChild('crudButtons', { read: ViewContainerRef })
  crudButtons;

  selection = new SelectionModel<Customer>(true, []);
  //

  filterQuestions: any[];



  // Injecting services.
  // #################################################
  constructor(
    private router: Router,
    private customerService: CustomerService,
    // private httpErrorHandler: HttpErrorHandler,
    private dialog: MatDialog,
    // private snackBar: MatSnackBar
    filterQuestionService: FilterService,
  ) {
    this.filterQuestions = filterQuestionService.getFilters();
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
        tap(() => this.loadCustomers())
      )
      .subscribe();

    // // Filtration, bind to searchInput element
    // fromEvent(this.searchInput.nativeElement, 'keyup')
    //   .pipe(
    //     debounceTime(150), // limiting server requests to one every 150ms
    //     distinctUntilChanged(), // eliminating duplicate values
    //     tap(() => {
    //       this.paginator.pageIndex = 0;
    //       this.loadCustomers();
    //     })
    //   )
    //   .subscribe();


    // Init DataSource
    const queryParams = new QueryParams();
    queryParams.filter = this.filterConfig(false);

    // Initial data load.
    // ########################################
    this.dataSource = new CustomerDataSource(this.customerService);
    this.dataSource.loadCustomers(queryParams);

    this.dataSource.customers
      .subscribe(
        res => this.customers = res
      );
  }


  /**
   * ##################################################################
   * Load customers.
   * ##################################################################
   */
  onDynamicFilterFormSubmit(value) {
    this.filterFormValue = value;
    this.loadCustomers();
  }

  loadCustomers() {

    const queryParams = new QueryParams();

    /** Setting filters based on search criteria */
    // queryParams.filter = this.filterConfig(true);
    queryParams.filter = this.filterFormValue;

    queryParams.sortOrder = this.sort.direction;
    queryParams.sortField = this.sort.active; /** The id of the column being sorted. */
    queryParams.pageNumber = this.paginator.pageIndex;
    queryParams.pageSize = this.paginator.pageSize;

    /** Delegating to customer data source.
     * #######################################
     */
    this.dataSource.loadCustomers(queryParams);

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
    // const numRows = this.customers.length;
    return this.selection.selected.length === this.customers.length;
  }

  /** Selects all rows if not all selected; otherwise clears selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.customers.forEach(customer =>
        this.selection.select(customer)
      );
  }





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
    // #########################################################
    const dialogRef = this.dialog.open(CustomerDetailDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(
        res => {
          if (!res) { return; }
          this.loadCustomers();
        }
      );
  }


  /**
   * Navigate to customer detail.
   */
  onSelect(row: Customer) {
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
          // #######################################
          this.customerService.deleteCustomers(ids)
            .subscribe(
              () => {
                this.loadCustomers();
                this.selection.clear();
              },
              // err handled in customerService
            );
        }
      );
  }


}
