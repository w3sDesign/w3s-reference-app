import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef, AfterViewInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragStart, CdkDropList, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { fromEvent, merge, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';

import { Product } from '../model/product';
import { ProductDataSource } from '../model/product.datasource';

import { DynamicFormGroupService } from '../../shared/dynamic-form/dynamic-form-group.service';
import { QueryParams } from '../../shared/query-params';
import { MessageDialogComponent } from '../../shared/message-dialog/message-dialog.component';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';

import { ProductDetailDialogComponent } from '../product-detail/product-detail.component';

import { MessageSnackBarComponent } from '../../shared/message-snack-bar/message-snack-bar.component';

import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent } from '../../shared/dynamic-form/dynamic-form-question.component';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../../shared/dynamic-form/question-base';
import { mockProductQuestions } from '../model/mock-product-questions';

import { ProductFilterTemplate } from '../model/product-filter-template';

import { InputDialogComponent } from '../../shared/input-dialog/input-dialog.component';

import { DynamicFormOptions } from '../../shared/dynamic-form/dynamic-form-options';
import { mockProducts } from '../model/mock-products';


import { ProductService } from '../model/product.service';
import { HttpProductService } from '../model/http-product.service';
import { MessageService } from '../../shared/message.service';
// import { FocusMonitor } from '@angular/cdk/a11y';

import * as moment from 'moment';
import { MomentDatePipe } from '../../shared/pipes/momentDate.pipe';
import { UtilsService } from '../../shared/utils.service';



@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})

/**
 * Main component for product data entry and management.
 * ####################################################################
 */

export class ProductListComponent implements OnInit, AfterViewInit, OnChanges {

  showTestValues = true;
  // consoleLogStyle = 'color: blue; font-weight: 500; line-height: 20px;';

  /**
   * The data source object
   * - is responsible for retrieving and emitting the product objects
   *   the table should display.
   */
  dataSource: ProductDataSource;

  products: Product[] = [];
  selectedProduct: Product;
  selectedProductId: number;
  // new used instead of products?
  // products$: Observable<Product[]>;

  /** activated = selected with user input */
  /** Values set in onQueryParamsChange() from filter-template component */
  // activatedFilterTemplateId: number;
  // activatedFilters: any;
  // activatedSearchTerm: string;

  // Most recently activated query params.
  activatedQueryParams: QueryParams;
  //////////////////////////////////


  // new From router / activated route
  // routeProductId: number;
  // routeFilterTemplateId: number;

  // productQuestions: QuestionBase[] = mockProductQuestions.slice();

  /** All possible columns that can be displayed. */
  // TODO should be generated from questions
  availableColumns: string[] = [
    'select', 'id', 'name', 'type', 'status', 'comment', 'creationDate',
    'country', 'postalCode', 'city', 'street',
    'department', 'person', 'phone', 'email'
  ];

  /** Columns displayed in the data table. */
  /** = selected in the columnSelection table. */
  displayedColumns: string[] = [
    'select', 'id', 'name', 'country', 'city', 'phone', 'email'
  ];




  /** MatPaginator component for navigating between pages. */
  @ViewChild(MatPaginator, {static: false}) matPaginator: MatPaginator;

  /** MatSort directive for sorting table columns. */
  @ViewChild(MatSort, {static: false}) matSort: MatSort;

  // /** Searching in all fields. */
  // @ViewChild('searchInput') searchInput: ElementRef;

  /** Selecting products (selecting specific table rows). */
  productSelection = new SelectionModel<Product>(true, []);

  /** Selecting columns (selecting which columns to display). */
  /** Args: allowMultiSelect, initialSelection */
  columnSelection = new SelectionModel<string>(true, this.displayedColumns);

  /** Table for column selection. */
  @ViewChild('columnSelectionTable', {static: false}) columnSelectionTable: MatTable<string[]>;

  /** Needed for drag and drop columns. */
  previousDragIndex: number;


  /** Create/Update/Delete buttons. */
  @ViewChild('crudButtons', { read: ViewContainerRef , static: false}) crudButtons;





  // Component constructor.
  // ##################################################################

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private formGroupService: DynamicFormGroupService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private httpUtils: UtilsService,
  ) {

    this.dataSource = new ProductDataSource(
      this.productService, this.httpUtils, this.messageService);
    // this.filterTemplateQuestions = this.generateFilterTemplateQuestions();

    this.activatedQueryParams = new QueryParams();
  }


  // Component lifecycle hook.
  // ##################################################################
  // Called once after creating the component,
  // but before creating child components.

  ngOnInit() {

    this.logMessage(`[ngOnInit()] ########################################`);

    // Setting parameters from activated route
    // (from navigateToList() in ProductDetailComponent).

    this.route.paramMap.pipe(
      switchMap((routeParams: ParamMap) => {

        // Setting selected product id from activated route.

        // this.selectedProductId = +this.route.snapshot.paramMap.get('id');
        // = 0 when id is null (because + converts null to 0)

        this.selectedProductId = +routeParams.get('id');


        // Setting displayed columns from activated route.

        const dc: string = routeParams.get('displayedColumns');
        this.logMessage(
          `[ngOnInit()] routeParams.get('displayedColumns') = ${dc}`
        );
        if (dc) {
          this.displayedColumns = JSON.parse(dc);
          this.logMessage(
            `[ngOnInit()] routeParams / displayedColumns = ${JSON.stringify(this.displayedColumns)}`
          );
        }


        // Setting query params from activated route.

        const qp: string = routeParams.get('queryParams');
        this.logMessage(
          `[ngOnInit()] routeParams.get('queryParams') = ${qp}`
        );
        if (qp) {
          this.activatedQueryParams = JSON.parse(qp) as QueryParams;
          // this.dataSource.getProducts(JSON.parse(qp) as QueryParams);
          // } else {
          //   this.dataSource.getProducts(this.activatedQueryParams);
        }


        this.dataSource.getProducts(this.activatedQueryParams);
        ////////////////////////////////////////////////////////

        return of(routeParams);
      })

    ).subscribe();




    // Setting this.products object array.
    this.dataSource.products$
      .subscribe(res => {
        this.products = res;

        this.logMessage(
          `[ngOnInit() products$.subscribe] this.products = \n ${JSON.stringify(this.products)}`
        );
      });

  }



  // Component lifecycle hook.
  // ##################################################################
  // Called once after creating the child components.

  ngAfterViewInit() {

    this.logMessage(`[ngAfterViewInit()] ========================================`);


    // TODO? Moving to view? (sortChange)="onSortChange"

    // Observing matSort (sortChange) event
    // emitted when either active sort or sort direction changes.

    this.matSort.sortChange
    .subscribe(() => {
      this.activatedQueryParams.sortField = this.matSort.active;
      this.activatedQueryParams.sortOrder = this.matSort.direction;
      // Reset to first page.
      this.activatedQueryParams.pageNumber = 0;
      this.matPaginator.pageIndex = 0;

      // Load data
      this.dataSource.getProducts(this.activatedQueryParams);
    });


    // TODO? Moving to view? (page)="onPageChange"

    // Observing matPaginator (page) event
    // emitted when either page size or page index changes.

    this.matPaginator.page
      .subscribe(() => {
        this.activatedQueryParams.pageNumber = this.matPaginator.pageIndex;
        this.activatedQueryParams.pageSize = this.matPaginator.pageSize;

        this.dataSource.getProducts(this.activatedQueryParams);
      });

  }


  // Component lifecycle hook.
  // ##################################################################
  // Called whenever data-bound input properties change.

  ngOnChanges() {

    this.logMessage(
      `[ngOnChanges()]`
    );

  }







  // ##################################################################
  // Component public member methods (in alphabetical order).
  // ##################################################################



  /** Whether number of selected products matches total number of products. */
  allProductsSelected(): boolean {
    const selected = this.productSelection.selected.length;
    const all = this.products.length;
    return selected === all;
  }


  /** Whether number of selected columns matches total number of columns. */
  allColumnsSelected(): boolean {
    const selected = this.columnSelection.selected.length;
    const all = this.availableColumns.length;
    return selected === all;
  }


  /**
   * Create a product (by updating an empty product).
   * ##################################################################
   */

  createProduct() {

    // Creating an empty product with id = 0.
    // const product = new Product();

    // Updating this empty product.
    // this.updateProduct(product);

    this.navigateToDetail(0);

  }




  /**
   * Delete selected product(s).
   * ##################################################################
   */

  deleteProducts() {
    if (this.productSelection.isEmpty()) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Delete Products',
          message: `Please select the product(s) to delete.`,
          showActions: false
        }
      });
      return;
    }

    const numberOfSelections = this.productSelection.selected.length;
    const product_s = numberOfSelections <= 1 ? 'product' : `${numberOfSelections} products`;

    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        title: 'Delete Products',
        message: `Are you sure to permanently delete the selected ${product_s}?`,
        showActions: true
      }
    });

    dialogRef.afterClosed()
      .subscribe(
        ok => {
          if (!ok) { return; }

          // Start deleting. Identify selected products.
          const ids: number[] = [];
          for (let i = 0; i < numberOfSelections; i++) {
            ids.push(this.productSelection.selected[i].id);
          }

          // Delete identified (selected) products.
          /////////////////////////////////////////
          this.productService.deleteProducts(ids)
            .subscribe(
              () => {
                this.matPaginator.pageIndex = 0;
                this.dataSource.getProducts(this.activatedQueryParams);
                this.productSelection.clear();
              },
              // err handled in productService
            );
        }
      );
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
      this.setDisplayedColumns();
    }
  }

  // drop(event: CdkDragDrop<Product[]>) {
  //   moveItemInArray(this.products, event.previousDragIndex, event.currentIndex);
  // }
  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.availableColumns, event.previousDragIndex, event.currentIndex);
  // }






  /**
   * Getting most recently activated query parameters.
   * ##################################################################
   */

  // NIXgetQueryParams(): QueryParams {

  //   const queryParams = new QueryParams();

  //   queryParams.filterTemplateId = this.activatedFilterTemplateId;

  //   if (this.activatedFilters) { queryParams.filter = this.activatedFilters; }
  //   if (this.activatedSearchTerm) { queryParams.searchTerm = this.activatedSearchTerm; }

  //   queryParams.sortOrder = this.sort.direction;
  //   queryParams.sortField = this.sort.active;

  //   queryParams.pageNumber = this.matPaginator.pageIndex;
  //   queryParams.pageSize = this.matPaginator.pageSize;

  //   return queryParams;

  // }





  /**
 * Navigating to the ProductDetailComponent.
 * ##################################################################
 */

  navigateToDetail(id: number, ids?: number[]) {

    this.router.navigate(['/products', id, {
      ids: ids ? ids : null,
      displayedColumns: JSON.stringify(this.displayedColumns),
      queryParams: JSON.stringify(this.activatedQueryParams),
    }]);
  }





  /**
   * Filters and search term emitted by the filter-template component.
   * ##################################################################
   */

  onQueryParamsChange(params: QueryParams) {

    this.activatedQueryParams.filterTemplateId = params.filterTemplateId;
    this.activatedQueryParams.filter = params.filter;
    this.activatedQueryParams.searchTerm = params.searchTerm;

    this.activatedQueryParams.pageNumber = 0;

    // this.activatedFilterTemplateId = params.filterTemplateId;
    // this.activatedFilters = params.filter;
    // this.activatedSearchTerm = params.searchTerm;

    this.matPaginator.pageIndex = 0;

    this.logMessage(
      `[onQueryParamsChange()] this.activatedQueryParams.filter = \n ${JSON.stringify(this.activatedQueryParams.filter)}`
    );

    this.dataSource.getProducts(this.activatedQueryParams);
    /////////////////////////////////////////

    this.productSelection.clear();

  }




  /**
   * Sets which columns to display in the data table.
   * ##################################################################
   */

  setDisplayedColumns() {

    // Displayed columns ordered by their selection.
    // this.displayedColumns = this.columnSelection.selected;

    // Displayed columns ordered like available columns.
    this.displayedColumns = [];
    this.availableColumns.forEach((column, index) => {
      if (this.columnSelection.isSelected(column)) {
        this.displayedColumns.push(column);
      }
    });

    this.columnSelectionTable.renderRows();
  }


  /** Selects all products if not all selected; otherwise clears selection. */
  toggleAllProducts() {
    this.allProductsSelected() ?
      this.productSelection.clear() :
      this.products.forEach(product => this.productSelection.select(product));
  }


  /** Selects all columns if not all selected; otherwise clears selection. */
  toggleAllColumns() {
    this.allColumnsSelected() ?
      this.columnSelection.clear() :
      this.availableColumns.forEach(column => this.columnSelection.select(column));
  }


  /**
   * Update selected products (by opening a modal dialog.
   * ##################################################################
   * TODO: multiple selections
   */

  ORIGupdateProduct(product?: Product) {
    if (!product) {
      if (this.productSelection.isEmpty()) {
        this.dialog.open(MessageDialogComponent, {
          data: {
            title: 'Update Selected Products',
            message:
              'Please select the products to update.',
            showActions: false
          }
        });
        return;
      }
      product = this.productSelection.selected[0];
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = "auto"; 800px
    // dialogConfig.minHeight = "auto"; 200px
    // dialogConfig.maxHeight = "auto"; 800px
    dialogConfig.panelClass = 'w3s-dialog-panel'; // in global styles.scss
    dialogConfig.data = { product };

    // Open modal dialog and load ProductDetailDialogComponent.
    // ################################################################
    const dialogRef = this.dialog.open(ProductDetailDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(
        res => {
          if (!res) { return; }
          this.matPaginator.pageIndex = 0;
          this.dataSource.getProducts(this.activatedQueryParams);
          this.productSelection.clear();
        }
      );
  }

  /**
   * New: Update selected products (by navigating to detail component).
   * ##################################################################
   * TODO: multiple selections
   */

  updateProduct(id?: number) {

    // (1) Update product with the clicked row.id.

    if (id) {

      this.navigateToDetail(id);

      // this.router.navigate(['/products', id, {
      //   displayedColumns: JSON.stringify(this.displayedColumns),
      //   queryParams: JSON.stringify(this.activatedQueryParams)
      // }]);

      return;
    }

    // (2) Update selected products (no row.id).

    if (this.productSelection.isEmpty()
      || !this.productSelection.selected.length) {

      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Update Selected Products',
          message:
            'Please select the products to update.',
          showActions: false
        }
      });
      return;
    }

    // Update products with the selected ids.

    const ids: number[] = [];
    for (let i = 0; i < this.productSelection.selected.length; i++) {
      ids[i] = this.productSelection.selected[i].id;
    }

    this.navigateToDetail(ids[0], ids);

    // this.router.navigate(['/products', ids[0], {
    //   ids: ids,
    //   displayedColumns: JSON.stringify(this.displayedColumns),
    //   queryParams: JSON.stringify(this.activatedQueryParams)
    // }]);

  }






  // ##################################################################
  // Component non public member methods.
  // ##################################################################


  /** Logging message to console. */
  private logMessage(message: string) {
    return this.messageService.logMessage('[product-list.component.ts] ' + message);
  }

  /** Showing a user friendly message. */
  private showMessage(message: string) {
    return this.messageService.showMessage('*** ' + message + ' ***');
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


/**
   * Setting query parameters and getting products from dataSource.
   * ##################################################################
   */

  // NIXgetProducts(params?: QueryParams) {

  //   // Test
  //   // if (this.filterTemplateForm.form.value) {

  //   // (1) Setting queryParams.
  //   const queryParams = new QueryParams();

  //   if (params) {
  //     queryParams.searchTerm = params.searchTerm;
  //     queryParams.filter = params.filter;
  //   }

  //   // if (this.showTestValues) {
  //   //   console.log('%c########## queryParams [getProducts()] = \n' +
  //   //     JSON.stringify(queryParams), 'color: darkblue');
  //   // }

  //   queryParams.sortOrder = this.sort.direction;
  //   // The id of the column being sorted.
  //   queryParams.sortField = this.sort.active;
  //   queryParams.pageNumber = this.matPaginator.pageIndex;
  //   queryParams.pageSize = this.matPaginator.pageSize;

  //   // (2) Getting products from dataSource.
  //   this.dataSource.getProducts(queryParams);
  //   /////////////////////////////////////////


