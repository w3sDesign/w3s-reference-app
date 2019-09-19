
//
// Change log
// ####################################################################
// Update activeFilters - moved to getProducts()
// ####################################################################


import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragStart, CdkDropList, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { fromEvent, merge, Observable } from 'rxjs';
//
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';

import { ProductDataSource } from '../model/product.datasource';
import { MessageDialogComponent } from '../../shared/message-dialog/message-dialog.component';
//
import { Product } from '../model/product';
import { QueryParams } from '../../shared/query-params';

import { ProductService } from '../model/http-product.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';

import { ProductDetailDialogComponent } from '../product-detail/product-detail.component';
import { Router } from '@angular/router';

import { MessageSnackBarComponent } from '../../shared/message-snack-bar/message-snack-bar.component';

import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent } from '../../shared/dynamic-form/dynamic-form-question.component';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../../shared/dynamic-form/question-base';
import { mockProductQuestions } from '../model/mock-product-questions';

import { ProductFilterTemplate } from '../model/product-filter-template';

import { InputDialogComponent } from '../../shared/input-dialog/input-dialog.component';

import { DynamicFormOptions } from '../../shared/dynamic-form/dynamic-form-options';
import { DynamicFormGroupService } from '../../shared/dynamic-form/dynamic-form-group.service';
import { mockProducts } from '../model/mock-products';



@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit, AfterViewInit {

  showTestValues = true;
  // consoleLogStyle = 'color: blue; font-weight: 500; line-height: 20px;';

  // ##################################################################
  // (1) Filter section related properties.
  // ##################################################################

  /** All possible filters. */
  availableFilters: string[] =
    [
      'idFilter', 'nameFilter',
      'typeFilter', 'statusFilter', 'commentFilter', 'creationDateFilter',
      'countryFilter', 'postalCodeFilter', 'cityFilter', 'streetFilter',
      'phoneFilter', 'emailFilter'
    ];

  /** Filters that should be displayed in the filter template form. */
  filtersToDisplay: string[] = [];
  // [
  //   'idFilter', 'nameFilter',
  // ];

  /** Active filters used by last data load [getProducts()] */
  activeFilters: string[] = [];
  activeFiltersText = '';


  /**
   * Reference to the filter template form.
   * Not set before AfterViewInit.
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
   * - Generated from product questions.
   */
  filterTemplateQuestions: QuestionBase[];

  /** Filter templates */
  filterTemplates: ProductFilterTemplate[]; // mockProductFilterTemplates;

  // selectedFilterTemplate: ProductFilterTemplate;

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
   * - is responsible for retrieving and emitting the product objects
   *   the table should display.
   */
  dataSource: ProductDataSource;

  products: Product[] = [];
  selectedProduct: Product;

  // productQuestions: QuestionBase[] = mockProductQuestions.slice();

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
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /** Sorting table columns */
  @ViewChild(MatSort) sort: MatSort;

  /** Searching in all fields */
  @ViewChild('searchInput') searchInput: ElementRef;

  /** Selection handling - data table rows. */
  rowSelection = new SelectionModel<Product>(true, []);


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
    private productService: ProductService,
    private router: Router,
    private formGroupService: DynamicFormGroupService,
    private dialog: MatDialog,
  ) {

    this.filterTemplateQuestions = this.generateFilterTemplateQuestions();
  }



  ngAfterViewInit() {

    if (this.showTestValues) {
      console.log('%c########## this.filterTemplateForm.form.value [ngAfterViewInit()] = \n' +
        JSON.stringify(this.filterTemplateForm.form.value), 'color: blue');
    }

  }


  // ##################################################################
  // OnInit
  // ##################################################################

  ngOnInit() {

    // this.onFilterTemplateFormValueChanges();

    if (this.showTestValues) {
      console.log('%c########## this.activeFilters [ngOnInit()] = \n' +
        JSON.stringify(this.activeFilters), 'color: blue');
    }


    // Get filter templates.
    // ################################################################
    // Getting filter templates and performing onSelectFilterTemplate(name).

    this.productService.getProductFilterTemplates()
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


    // Subscribing to searchInput changes.
    // ################################################################
    // Creating an observable from searchInput keyup events and
    // Whenever a 'keyup' event is emitted, a data load will be triggered.

    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        // Wait 300ms after each keystroke before considering the term.
        debounceTime(300),

        // ignore new term if same as previous term
        // eliminating duplicate values
        distinctUntilChanged(),

        // switchMap((res) => {

        //   this.getProducts();
        //   // Reset to first page.
        //   this.paginator.pageIndex = 0;

        // })

        tap(() => {
          this.paginator.pageIndex = 0;
          this.getProducts();
        })
      )
      .subscribe();

    // .subscribe(() => {

    //   // getProducts without queryParams.
    //   // this.onClearFilters();
    //   this.getProducts();
    //   // Reset to first page.
    //   this.paginator.pageIndex = 0;
    // });


    // Subscribing to sort and page changes.
    // ################################################################
    // Whenever a sort/page change event is emitted, a data load will be triggered.

    this.sort.sortChange
      .subscribe(() => {
        this.getProducts();
        /** Reset to first page */
        this.paginator.pageIndex = 0;
      });

    this.paginator.page
      .subscribe(() => this.getProducts());


    // Performing initial data load.
    // ################################################################
    // Delegating data access to the ProductDataSource object.

    const queryParams = new QueryParams();
    // queryParams.filter = this.filterConfig(false);
    // queryParams.filter = {};

    this.dataSource = new ProductDataSource(this.productService);

    this.dataSource.getProducts(queryParams);

    this.dataSource.products
      .subscribe(
        res => this.products = res
      );

    // this.setColumnsToDisplay();

  } // ngOnInit()




  // ####################################################################
  // Methods
  // ####################################################################



  NIXonFilterTemplateFormValueChanges() {

    if (this.showTestValues) {
      console.log('%c########## this.filterTemplateForm.form.value [onFilterTemplateFormValueChanges()] = \n' +
        JSON.stringify(this.filterTemplateForm.form.value), 'color: blue');
    }


    // Update activeFilters when a form control value changes.
    // Updates too often - moved to getProducts()!

    this.filterTemplateForm.form.valueChanges.subscribe(val => {

      this.activeFilters = [];
      // const obj = this.filterTemplateForm.form.value;
      for (const key in val) {
        if (val[key]) {
          this.activeFilters.push(key);
        }
      }
    });

  }

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


    // (4) Setting form values and get (search) products.
    this.renderFilterTemplateForm(this.selectedFilterTemplateName);

  }


  onClearFilters() {
    // this.filterTemplateForm.form.reset();
    this.onSelectFilterTemplate('');

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

    // if (name) {

    // (1) Setting filtersToDisplay from selected filter template.
    const filterTemplate = this.filterTemplates.find(ft => ft.name === name);
    if (!filterTemplate) { return; }

    this.filtersToDisplay = [];
    Object.keys(filterTemplate).forEach((filterKey) => { // idFilter, nameFilter
      if (filterKey.includes('Filter')) {
        this.filtersToDisplay.push(filterKey);
      }
    });

    if (this.showTestValues) {
      console.log('%c########## this.filtersToDisplay [onSelectFilterTemplate(name)] = \n' +
        JSON.stringify(this.filtersToDisplay), 'color: blue');
      // console.dir(this.filtersToDisplay);
      // console.table(this.filtersToDisplay);
      // this.consoleLog('JSON.stringify(this.filtersToDisplay)');
    }

    // (2) Generating filterTemplate questions.
    this.filterTemplateQuestions = this.generateFilterTemplateQuestions();

    if (this.showTestValues) {
      console.log('%c########## this.filterTemplateQuestions [onSelectFilterTemplate(name)] = \n' +
        JSON.stringify(this.filterTemplateQuestions), 'color: blue');
      // this.consoleLog('JSON.stringify(this.filterTemplateQuestions)');
    }

    // (3) Generating filterTemplateForm.
    this.generateFilterTemplateForm(this.filterTemplateQuestions);

    // (4) Setting form values and get (search) products.
    this.renderFilterTemplateForm(name);

    // (5) Setting selected filters.
    this.filterSelection.clear();
    this.filtersToDisplay.forEach(filter => this.filterSelection.select(filter));

    this.selectingFiltersTable.renderRows();

    // } else {

    //   // Handling empty filter template.

    //   // this.onClearFilters();

    //   this.selectedFilterTemplateName = '';

    //   this.filterTemplateForm.form.reset();

    //   this.activeFilters = [];

    //   this.getProducts();  // get all products
    // }

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
    this.getProducts();

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
   * Generates the filter template questions from product questions.
   * ##################################################################
   */
  // generateFilterTemplateQuestions(fromQuestions: QuestionBase[]): QuestionBase[] {
  generateFilterTemplateQuestions(): QuestionBase[] {

    const fromQuestions = mockProductQuestions.filter(q => {
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

      // newObj['label'] = '';
      newObj['hint'] = 'Filter by ' + q.label;
      // TODO
      if (q.inputType === 'number') {
        newObj['toolTip'] = 'For example: 1000 (equal), <1000 (lower), >1000 (greater), 1000-2000 (between)';
      } else {
        newObj['toolTip'] = '';
      }

      return newObj;

    });

    // shown in onSelectFilterTemplate()
    // this.consoleLog('JSON.stringify(this.filterTemplateQuestions)');

    return filterTemplateQuestions as QuestionBase[];
  }


  /**
   * Generates the filter template form.
   * ##################################################################
   */
  generateFilterTemplateForm(questions: QuestionBase[]) {

    // this.filterTemplateForm.form = this.formGroupService.createFormGroup(questions);
    this.filterTemplateForm.createForm(questions);

    // this.getProducts();

    if (this.showTestValues) {
      console.log('%c########## this.filterTemplateForm.form.value [generateFilterTemplateForm()] = \n' +
        JSON.stringify(this.filterTemplateForm.form.value), 'color: blue');
    }

    // this.onFilterTemplateFormValueChanges();
  }


  // /**
  //  * Filter template form commit.
  //  */
  // onFilterTemplateFormSubmit(value) {
  //   this.filterTemplateFormValue = value;
  //   // this.selectedFilterTemplate = value;
  //   this.getProducts();
  // }


  // searchProducts() {
  //   this.filterTemplateFormValue = this.filterTemplateForm.form.value;
  //   this.getProducts();
  // }


  /**
   * Setting query parameters and getting  products.
   * ##################################################################
   */
  getProducts() {

    // Test
    if (this.filterTemplateForm.form.value) {



      // (1) Setting queryParams.
      const queryParams = new QueryParams();

      // Setting filters from the filter template form.
      const obj = this.filterTemplateForm.form.value;
      let isEmpty = true;
      Object.keys(obj).forEach(key => {
        if (obj[key]) { isEmpty = false; }
      });
      if (isEmpty) {
        // queryParams.filter = {};
        queryParams.searchTerm = this.searchInput.nativeElement.value;
      } else {
        queryParams.filter = this.filterTemplateForm.form.value;
      }

      if (this.showTestValues) {
        console.log('%c########## queryParams [getProducts()] = \n' +
          JSON.stringify(queryParams), 'color: darkblue');
      }

      queryParams.sortOrder = this.sort.direction;
      // The id of the column being sorted.
      queryParams.sortField = this.sort.active;
      queryParams.pageNumber = this.paginator.pageIndex;
      queryParams.pageSize = this.paginator.pageSize;

      // (2) Getting products.
      // Delegating to the product data source.
      this.dataSource.getProducts(queryParams);


      // (3) Update activeFilters.
      this.activeFilters = [];
      const obj1 = queryParams.filter; // = this.filterTemplateForm.form.value;
      for (const key in obj1) {
        if (obj1[key]) {
          this.activeFilters.push(key);
        }
      }

      const nr = this.activeFilters.length;
      this.activeFiltersText = (nr === 0) ? 'Currently no filters active.'
        : (nr === 1) ? 'Currently 1 filter active: ' : `Currently ${nr} filters active: `;

      this.rowSelection.clear();

    }
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
    const all = this.products.length;
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
      this.products.forEach(product => this.rowSelection.select(product));
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

  // drop(event: CdkDragDrop<Product[]>) {
  //   moveItemInArray(this.products, event.previousDragIndex, event.currentIndex);
  // }
  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.availableColumns, event.previousDragIndex, event.currentIndex);
  // }




  /**
   * ##################################################################
   * Create a product (by updating a new product).
   * ##################################################################
   */
  createProduct() {
    // Create a new product with defaults.
    const product = new Product();
    // Update the product.
    this.updateProduct(product);
  }


  /**
   * ##################################################################
   * Create a filter template.
   * ##################################################################
   */
  createFilterTemplate(filterTemplate: ProductFilterTemplate) {

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

          /** Delegating to product service */
          this.productService.createProductFilterTemplate(filterTemplate)
            .subscribe(
              () => {
                this.productService.getProductFilterTemplates()
                  .subscribe(
                    (res) => {
                      this.filterTemplates = res;
                      // this.consoleLog('JSON.stringify(this.filterTemplates');

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
                    // err handled in productService
                  );
              }
            );
        }
      );

  }







  /**
   * ##################################################################
   * Update selected products (by opening a modal dialog.
   * TODO: multiple selections
   * ##################################################################
   */
  updateProduct(product?: Product) {
    if (!product) {
      if (this.rowSelection.isEmpty()) {
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
      product = this.rowSelection.selected[0];
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
          this.getProducts();
        }
      );
  }


  /**
   * ##################################################################
   * Update a filter template.
   * ##################################################################
   */
  updateFilterTemplate(filterTemplate: ProductFilterTemplate) {
    this.productService.updateProductFilterTemplate(filterTemplate)
      .subscribe(
        () => {
          // Also update the in memory filter templates (this.filterTemplates).
          const idx = this.filterTemplates.findIndex(element => element.id === filterTemplate.id);
          this.filterTemplates[idx] = filterTemplate;
        },
        // err handled in productService
      );
  }







  /**
  * Navigate to product detail.
  */
  goToProductDetail(row: Product) {
    this.selectedProduct = row;
    this.router.navigate(['/products', row.id]);
  }


  /**
   * ##################################################################
   * Delete selected product(s).
   * ##################################################################
   */
  deleteProducts() {
    if (this.rowSelection.isEmpty()) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Delete Products',
          message: `Please select the product(s) to delete.`,
          showActions: false
        }
      });
      return;
    }

    const numberOfSelections = this.rowSelection.selected.length;
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
            ids.push(this.rowSelection.selected[i].id);
          }

          // Delete identified (selected) products.
          // ##########################################################
          this.productService.deleteProducts(ids)
            .subscribe(
              () => {
                this.getProducts();
                this.rowSelection.clear();
              },
              // err handled in productService
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
