//
// Change log
// ####################################################################
// Update activeFilters - moved to emitQueryParams()
// ####################################################################


// tslint:disable-next-line:max-line-length
import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef, AfterViewInit, EventEmitter, Output } from '@angular/core';

import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort, MatTable } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragStart, CdkDropList, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { fromEvent, merge, Observable, TimeoutError } from 'rxjs';
//
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';

import { CustomerDataSource } from '../model/customer.datasource';
import { MessageDialogComponent } from '../../shared/message-dialog/message-dialog.component';
//
import { Customer } from '../model/customer';
import { QueryParams } from '../../shared/query-params';

import { HttpCustomerService as CustomerService } from '../model/http-customer.service';
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
import { mockCustomers } from '../model/mock-customers';



@Component({
  selector: 'w3s-customer-filter-template',
  templateUrl: './customer-filter-template.component.html',
  styleUrls: ['./customer-filter-template.component.scss']
})

export class CustomerFilterTemplateComponent implements OnInit, AfterViewInit {

  private showTestValues = true;
  // consoleLogStyle = 'color: blue; font-weight: 500; line-height: 20px;';

  // ##################################################################
  // (1) Filter section related properties.
  // ##################################################################

  /** Child emits a queryParamsChange event to which parents can listen. */
  @Output() queryParamsChange = new EventEmitter<any>();


  /** All possible filters. */
  private availableFilters: string[] =
    [
      'idFilter', 'nameFilter',
      'typeFilter', 'statusFilter', 'commentFilter', 'creationDateFilter',
      'countryFilter', 'postalCodeFilter', 'cityFilter', 'streetFilter',
      'phoneFilter', 'emailFilter'
    ];

  availableFiltersText: string[]; // 'Id', 'Name', ...

  /** Filters that should be displayed in the filter template form. */
  filtersToDisplay: string[] = [];
  // [
  //   'idFilter', 'nameFilter',
  // ];

  /** Active filters used by the most recent search. */
  activeFilters: string[] = [];
  activeFiltersText = '';


  /**
   * Reference to the filter template form.
   * Not set before AfterViewInit.
   */
  @ViewChild('filterTemplateForm')
  private filterTemplateForm: DynamicFormComponent;

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


  /** Searching in all fields */
  // @ViewChild('searchInput') searchInput: ElementRef;

  searchInputModel = '';



  // ##################################################################
  // Constructor
  // ##################################################################

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private formGroupService: DynamicFormGroupService,
    private dialog: MatDialog,
  ) {

    this.filterTemplateQuestions = this.generateFilterTemplateQuestions();

    this.availableFiltersText = this.availableFilters.map(filter => filter.replace('Filter', ''));
  }



  ngAfterViewInit() {

    if (this.showTestValues) {
      console.log('%c########## [customer-filter-template / ngAfterViewInit()] this.filterTemplateForm.form.value = \n' +
        JSON.stringify(this.filterTemplateForm.form.value), 'color: blue');
    }

  }




  // ##################################################################
  // OnInit
  // ##################################################################

  ngOnInit() {

    if (this.showTestValues) {
      console.log('%c########## [customer-filter-template / ngOnInit()] this.activeFilters = \n' +
        JSON.stringify(this.activeFilters), 'color: blue');
    }


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


    // Subscribing to searchInput changes.
    // ################################################################
    // Creating an observable from searchInput keyup events and
    // Whenever a 'keyup' event is emitted, a data load will be triggered.

    // fromEvent(this.searchInput.nativeElement, 'keyup')
    //   .pipe(
    //     // Wait 300ms after each keystroke before considering the term.
    //     debounceTime(300),

    //     // ignore new term if same as previous term
    //     // eliminating duplicate values
    //     distinctUntilChanged(),

    //     // switchMap((res) => {

    //     //   this.getCustomers();
    //     //   // Reset to first page.
    //     //   this.paginator.pageIndex = 0;

    //     // })

    //     tap(() => {
    //       this.paginator.pageIndex = 0;
    //       this.getCustomers();
    //     })
    //   )
    //   .subscribe();

    // // .subscribe(() => {

    // //   // getCustomers without queryParams.
    // //   // this.onClearFilters();
    // //   this.getCustomers();
    // //   // Reset to first page.
    // //   this.paginator.pageIndex = 0;
    // // });



  } // ngOnInit()




  // ####################################################################
  // Methods
  // ####################################################################

  onSearchInputChange() {

    if (this.selectedFilterTemplateName !== '') {
      this.selectedFilterTemplateName = '';
      this.onSelectFilterTemplate('');
    } else {
      this.emitQueryParams();
    }
  }

  /** Whether all filters are empty.  */
  isFilterTemplateFormEmpty() {
    // Setting filters from the filter template form.
    const obj = this.filterTemplateForm.form.value;

    let empty = true;
    Object.keys(obj).forEach(key => {
      if (obj[key]) { empty = false; }
    });
    return empty;

  }


  /**
   * Child emits query parameters for which parents can listen.
   * ##################################################################
   */
  emitQueryParams() {

    // Test
    if (this.filterTemplateForm.form.value) {

      // (1) Setting queryParams.

      const queryParams = new QueryParams();

      // Setting filters from the filter template form.
      // const obj = this.filterTemplateForm.form.value;

      // let isFormEmpty = true;
      // Object.keys(obj).forEach(key => {
      //   if (obj[key]) { isFormEmpty = false; }
      // });

      if (this.isFilterTemplateFormEmpty()) {
        // queryParams.filter = {};
        // queryParams.searchTerm = this.searchInput.nativeElement.value;

        queryParams.searchTerm = this.searchInputModel;
      } else {
        queryParams.filter = this.filterTemplateForm.form.value;
      }

      if (this.showTestValues) {
        console.log('%c########## [customer-filter-template / emitQueryParams()] queryParams = \n' +
          JSON.stringify(queryParams), 'color: blue');
      }


      // (2) Emitting queryParams.

      this.queryParamsChange.emit(queryParams);
      ////////////////////////////////////////


      // (3) Update activeFilters.


      this.activeFilters = [];
      this.activeFiltersText = 'Currently no filters active.';

      if (queryParams.filter) {

        const obj1 = queryParams.filter; // = this.filterTemplateForm.form.value;
        for (const key in obj1) {
          if (obj1[key]) {
            this.activeFilters.push(key);
          }
        }

        const nr = this.activeFilters.length;
        this.activeFiltersText = (nr === 0) ? 'Currently no filters active.'
          : (nr === 1) ? 'Currently 1 filter active: ' : `Currently ${nr} filters active: `;

      }

      if (queryParams.searchTerm) {
        this.activeFiltersText = `Currently active search term: "${queryParams.searchTerm}"`;
      }

    }
  }



  NIXonFilterTemplateFormValueChanges() {

    // Update activeFilters when a form control value changes.
    // Updates too often - moved to emitQueryParams()!

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
   * Event Handler that reacts on `mat-checkbox` `change` events.
   * ##################################################################
   * The `change` event is emitted when the checkbox's `checked` value changes.
   */

  // ? onFilterCheckboxChange
  onSelectFilter(event) {

    if (this.showTestValues) {
      console.log('%c########## [customer-filter-template / onSelectFilter()] event.checked = \n' +
        JSON.stringify(event.checked), 'color: blue');
    }

    // (1) Set filtersToDisplay from selected filters.
    this.filtersToDisplay = [];
    this.availableFilters.forEach((filter, index) => {
      if (this.filterSelection.isSelected(filter)) {
        this.filtersToDisplay.push(filter);
      }
    });
    // this.selectingFiltersTable.renderRows();//?


    // (2) Generate filterTemplateQuestions.
    this.filterTemplateQuestions = this.generateFilterTemplateQuestions();


    // (3) Generate filterTemplateForm.
    this.generateFilterTemplateForm(this.filterTemplateQuestions);


    // (4) Render filter template form
    this.renderFilterTemplateForm(this.selectedFilterTemplateName);


    // (5) Emit QueryParams
    this.emitQueryParams();


  }


  // onClearFilters() {
  //   // this.filterTemplateForm.form.reset();
  //   this.onSelectFilterTemplate('');

  // }


  /**
   * Event Handler that reacts on `mat-select` `selectionChange` events.
   * ##################################################################
   * The `selectionChange` event is emitted when the selected value has been changed by the user.
   *
   * @param name The name of the filter template.
   *
   * For example:
   *  filter template name = 'standard': [idFilter: '>20010', nameFilter: 'Foundation']
   *  filtersToDisplay: [idFilter, nameFilter]
   *
   *  filter template name = '':  [idFilter: '', nameFilter: '']
   *  The 'standard' filter template with empty filters.
   */

  onSelectFilterTemplate(name: string) {

    // Either searching or filtering.
    if (name !== '') {
      this.searchInputModel = '';
    }

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
      console.log('%c########## [customer-filter-template / onSelectFilterTemplate(name)] this.filtersToDisplay = \n' +
        JSON.stringify(this.filtersToDisplay), 'color: blue');

      // console.dir(this.filtersToDisplay);
      // console.table(this.filtersToDisplay);
      // this.consoleLog('JSON.stringify(this.filtersToDisplay)');
    }

    // (2) Generating filterTemplate questions.
    this.filterTemplateQuestions = this.generateFilterTemplateQuestions();

    if (this.showTestValues) {
      console.log('%c########## [customer-filter-template / onSelectFilterTemplate(name)] this.filterTemplateQuestions = \n' +
        JSON.stringify(this.filterTemplateQuestions), 'color: blue');
      // this.consoleLog('JSON.stringify(this.filterTemplateQuestions)');
    }

    // (3) Generating filterTemplateForm.
    this.generateFilterTemplateForm(this.filterTemplateQuestions);

    // (4) Render filter template form.
    this.renderFilterTemplateForm(name);

    // (5) Emit QueryParams
    this.emitQueryParams();

    // (6) Set selected filters.
    this.filterSelection.clear();
    this.filtersToDisplay.forEach(filter => this.filterSelection.select(filter));

    this.selectingFiltersTable.renderRows();

    // } else {

    //   // Handling empty filter template.

    //   // this.onClearFilters();

    //   this.selectedFilterTemplateName = '';

    //   this.filterTemplateForm.form.reset();

    //   this.activeFilters = [];

    //   this.getCustomers();  // get all customers
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

    // this.emitQueryParams();

  }


  /**
   * Sets which columns to display in the data table.
   * ##################################################################
   */
  // setColumnsToDisplay() {
  //   this.columnsToDisplay = [];
  //   this.availableColumns.forEach((column, index) => {
  //     if (this.columnSelection.isSelected(column)) {
  //       this.columnsToDisplay.push(column);
  //     }
  //   });
  //   this.selectingColumnsTable.renderRows();
  // }


  /**
   * Generates the filter template questions from customer questions.
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

      const obj = {};

      obj['name'] = q.name + 'Filter';
      obj['controlType'] = 'textbox';
      // obj['inputType'] = 'textarea';
      obj['inputType'] = 'text';

      // obj['label'] = '';
      obj['hint'] = 'Filter by ' + q.label;
      // TODO
      if (q.inputType === 'number') {
        obj['toolTip'] = 'For example: 1000 (equal), <1000 (lower), >1000 (greater), 1000-2000 (between)';
      } else {
        obj['toolTip'] = '';
      }

      return obj;

    });

    const obj1 = { name: 'id', controlType: 'textbox', inputType: 'number', isDisabled: true };
    const obj2 = { name: 'name', controlType: 'textbox', inputType: 'string', isDisabled: true };

    filterTemplateQuestions.unshift(obj1, obj2); // add to the beginning

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

    if (this.showTestValues) {
      console.log('%c########## [customer-filter-template / generateFilterTemplateForm()] this.filterTemplateForm.form.value = \n' +
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
  //   this.getCustomers();
  // }


  // searchCustomers() {
  //   this.filterTemplateFormValue = this.filterTemplateForm.form.value;
  //   this.getCustomers();
  // }


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



  /**
   * ##################################################################
   * Create a customer (by updating a new customer).
   * ##################################################################
   */
  // createCustomer() {
  //   // Create a new customer with defaults.
  //   const customer = new Customer();
  //   // Update the customer.
  //   this.updateCustomer(customer);
  // }


  /**
   * ##################################################################
   * Create a filter template.
   * ##################################################################
   */
  createFilterTemplate(filterTemplate: CustomerFilterTemplate) {

    const dialogRef = this.dialog.open(InputDialogComponent, {
      data: {
        title: 'Save As',
        message: `Please enter the new filter template name:   `,
        name: '',
      }
    });

    dialogRef.afterClosed()
      .subscribe(
        name => {
          if (!name) { return; }

          filterTemplate.name = name;
          // Returns the highest filter template id + 1
          filterTemplate.id = Math.max(...this.filterTemplates.map(template => template.id)) + 1;

          // Create filter template.
          this.customerService.createCustomerFilterTemplate(filterTemplate)
            .subscribe(
              () => {
                this.customerService.getCustomerFilterTemplates()
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

                      this.emitQueryParams();


                      // TODO http should do that!
                      // Mock must be done manually!
                      // ########################################
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
  // updateCustomer(customer?: Customer) {
  //   if (!customer) {
  //     if (this.rowSelection.isEmpty()) {
  //       this.dialog.open(MessageDialogComponent, {
  //         data: {
  //           title: 'Update Selected Customers',
  //           message:
  //             'Please select the customers to update.',
  //           showActions: false
  //         }
  //       });
  //       return;
  //     }
  //     customer = this.rowSelection.selected[0];
  //   }

  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   // dialogConfig.height = "auto"; 800px
  //   // dialogConfig.minHeight = "auto"; 200px
  //   // dialogConfig.maxHeight = "auto"; 800px
  //   dialogConfig.panelClass = 'w3s-dialog-panel'; // in global styles.scss
  //   dialogConfig.data = { customer };

  //   // Open modal dialog and load CustomerDetailDialogComponent.
  //   // ################################################################
  //   const dialogRef = this.dialog.open(CustomerDetailDialogComponent, dialogConfig);

  //   dialogRef.afterClosed()
  //     .subscribe(
  //       res => {
  //         if (!res) { return; }
  //         this.getCustomers();
  //       }
  //     );
  // }


  /**
   * ##################################################################
   * Update a filter template.
   * ##################################################################
   */
  updateFilterTemplate(filterTemplate: CustomerFilterTemplate) {

    if (!this.selectedFilterTemplateName) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Save Filter Template',
          message: 'No filter template selected. Try Save As.',
          showActions: 'cancel',
        }
      });
      return;
    }

    if (this.filterTemplateForm.isEmpty) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Save Filter Template',
          message: 'Nothing to save. All filters are empty.',
          showActions: 'cancel',
        }
      });
      return;
    }



    this.customerService.updateCustomerFilterTemplate(filterTemplate)
      .subscribe(
        () => {
          // MOck: update the in memory filter templates (this.filterTemplates).
          // const idx = this.filterTemplates.findIndex(element => element.id === filterTemplate.id);
          // this.filterTemplates[idx] = filterTemplate;

          this.customerService.getCustomerFilterTemplates()
            .subscribe(
              (res) => {
                this.filterTemplates = res;

                this.emitQueryParams();
              }
            );

        },
      );

  }



// ##################################################################
  // Helpers
  // ##################################################################

  /** Whether number of selected filters matches total number of filters. */
  private isAllSelected3(): boolean {
    const selected = this.filterSelection.selected.length;
    const all = this.availableFilters.length;
    return selected === all;
  }

  /** Selects all filters if not all selected; otherwise clears selection. */
  private masterToggle3() {
    this.isAllSelected3() ?
      this.filterSelection.clear() :
      this.availableFilters.forEach(filter => this.filterSelection.select(filter));
  }



}

