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
  // CustomerDataSource connects the data table with a data stream
  // that emmits the Customers to display.
  dataSource: CustomerDataSource;

  private customersToDisplay: Customer[] = [];

  columnsToDefine = [
    'id',
    'name',
    'type',
    'status',
    'comment',
    'creationDate',
    'country',
    'postalCode',
    'city',
    'street',
    'phone',
    'email'
  ];
  columnsToDisplay = [
    'select',
    'id',
    'name',
    'country',
    'postalCode',
    'city',
    'phone',
    'email'
  ];
  // Paging
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Sorting
  @ViewChild(MatSort) sort: MatSort;
  // Filtering
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('crudButtons', { read: ViewContainerRef }) crudButtons;
  filterStatus = '';
  filterType = '';
  // Selection (allow multiple selections = true, initiallySelectedValues = [])
  selection = new SelectionModel<Customer>(true, []);
  //

  // Injecting customer service
  constructor(
    private router: Router,
    private customerService: CustomerService,
    // private httpErrorHandler: HttpErrorHandler,
    private dialog: MatDialog,
    // private snackBar: MatSnackBar
  ) { }


  ngOnInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // Data load will be triggered in two cases:
    // - when a pagination event occurs => this.paginator.page (MatPaginator)
    // - when a sort event occurs => this.sort.sortChange (MatSort)
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadCustomers();
        })
      )
      .subscribe();

    // Filtration, bind to searchInput element
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        // tslint:disable-next-line:max-line-length
        debounceTime(150), // limiting server requests to one every 150ms
        distinctUntilChanged(), // eliminating duplicate values
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadCustomers();
        })
      )
      .subscribe();

    // Init DataSource
    const queryParams = new QueryParams();
    queryParams.filter = this.filterConfiguration(false);
    this.dataSource = new CustomerDataSource(this.customerService);
    // Initial Data Load /////////////////////
    this.dataSource.loadCustomers(queryParams);
    //////////////////////////////////////////
    this.dataSource.customers$$.subscribe(res => (this.customersToDisplay = res));
  }

  loadCustomers() {
    const queryParams = new QueryParams();
    queryParams.filter = this.filterConfiguration(true);
    queryParams.sortOrder = this.sort.direction;
    queryParams.sortField = this.sort.active; /** The id of the column being sorted. */
    queryParams.pageNumber = this.paginator.pageIndex;
    queryParams.pageSize = this.paginator.pageSize;
    //////////////////////////////////////////
    this.dataSource.loadCustomers(queryParams);
    //////////////////////////////////////////
    this.selection.clear();
  }


  /** FILTRATION */
  filterConfiguration(isGeneralSearch: boolean = true): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;

    if (this.filterStatus && this.filterStatus.length > 0) {
      filter.status = +this.filterStatus;
    }

    // if (this.filterType && this.filterType.length > 0) {
    //   filter.type = +this.filterType;
    // }

    // filter.lastName = searchText;
    filter.name = searchText;
    if (!isGeneralSearch) {
      return filter;
    }

    // filter.firstName = searchText;
    // filter.email = searchText;
    // filter.ipAddress = searchText;
    return filter;
  }

  /** Whether number of selected rows matches total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.customersToDisplay.length; // this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if not all selected; otherwise clears selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.customersToDisplay.forEach(customer =>
        this.selection.select(customer)
      );
  }

  /**
   * Create Customer
   */
  createCustomer() {
    const customer = new Customer();
    // customer.clear(); // Set all defaults fields
    this.updateCustomer(customer);
  }

  /**
   * Update selected customers.
   * TODO: multiple selections
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

    const dialogRef = this.dialog.open(CustomerDetailDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.loadCustomers();
    });
  }

  /**
   * Goto
   */
  gotoDetail(row: Customer) {
    // row = customer object
    // TODO customersToDisplay = dataSource.customers!
    // console.log('row.id = ' + row.id);
    // console.log('customersToDisplay[0].id = ' + this.customersToDisplay[0].id);
    // console.log('dataSource.customers[0].id = ' + this.dataSource.customers[0].id);
    // this.router.navigate(['/customers', {id: row.id}]);

    this.router.navigate(['/customers', row.id]);
  }


  /**
   * ##################################################################
   * Delete selected customer(s).
   * ##################################################################
   */
  deleteCustomers() {
    if (this.selection.isEmpty()) {
      const dialogRef = this.dialog.open(MessageDialogComponent, {
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

    dialogRef.afterClosed().subscribe(ok => {
      if (!ok) {
        return;
      }

      // Identify selected customers.
      const ids: number[] = [];
      for (let i = 0; i < numberOfSelections; i++) {
        ids.push(this.selection.selected[i].id);
      }
      // test id NOT FOUND
      // ids[0] = 1;

      // Delete identified (selected) customers.
      this.customerService.deleteCustomers(ids).subscribe(
        () => {
          this.loadCustomers();
          this.selection.clear();
        },
        // err => { } handled in customerService
      );
    });
  }


}
