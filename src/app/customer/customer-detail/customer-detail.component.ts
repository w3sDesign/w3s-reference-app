/**
 * CustomerDetailComponent
 * and
 * CustomerDetailDialogComponent extends CustomerDetailComponent.
 */
import {
  Component, OnInit, Inject, ElementRef, ViewChild, ChangeDetectionStrategy, AfterViewInit
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { HttpCustomerService } from '../model/http-customer.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';

import { TypesUtilsService } from '../../shared/types-utils.service';
import { Customer } from '../model/customer';
import { countries } from '../../shared/countries';

import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../shared/dynamic-form/question-base';
import { mockCustomerQuestions } from '../model/mock-customer-questions';
import { DynamicFormGroupService } from '../../shared/dynamic-form/dynamic-form-group.service';
import { DynamicFormOptions } from '../../shared/dynamic-form/dynamic-form-options';
// import { questionsConfig } from '../model/customer.config';


// changeDetection: ChangeDetectionStrategy.OnPush
@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {

  showTestValues = true;

  // customer: Customer | Observable<Customer>;
  customer$: Observable<Customer>;
  customer: Customer;

  customerForm: FormGroup; // = static form
  hasErrors = false;
  hasChanged = false;
  title = 'Customer';

  // loadingAfterSubmit: boolean = false;
  // @ViewChild("nameInput") nameInput: ElementRef;

  countries: any[] = countries;

  // dialogRef: MatDialogRef<CustomerDetailDialogComponent>;
  data: any;


  /** Reference to the dynamic form component */
  /** Not set before AfterViewInit! */
  @ViewChild(DynamicFormComponent)
  dynFormComponent: DynamicFormComponent;

  /**
   * Questions for generating the dynamic form:
   * <w3s-dynamic-form [questions]="customerQuestions" ...
   */
  // filterTemplateQuestions: QuestionBase[];
  // TODO? loading from server must be before app! APP-INITIALIZE?

  // Compare <w3s-dynamic-form [questions]="customerQuestions" ...
  customerQuestions: QuestionBase[] = mockCustomerQuestions;

  /** Data group names (e.g. 'Basic Data', 'Addresses'). */
  dataGroupNames: string[] = [];



  // Compare <w3s-dynamic-form [ngClass]="customerFormClass"
  // customerFormClass: any = {
  //   'flex-box': true,
  // };


  /** Filter templates */
  // customers: Customer[]; // mockCustomerFilterTemplates;

  customerFormValue: any = {};

  customerFormOptions: DynamicFormOptions = {
    formFieldAppearance: 'fill'
  };



  constructor(
    // public dialogRef: MatDialogRef<CustomerDetailDialogComponent>,
    // data object from open.dialog(): data = { customer }
    // @Inject(MAT_DIALOG_DATA) public data: any,

    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: HttpCustomerService,
    private httpErrorHandler: HttpErrorHandler,
    private typesUtilsService: TypesUtilsService,
    private formGroupService: DynamicFormGroupService,
  ) {
    /** Setting data group names. */
    for (let i = 0; i < 100; i++) {
      const idx = this.customerQuestions.findIndex(question => question.group === i + 1);
      if (idx === -1) { break; }
      this.dataGroupNames[i] = this.customerQuestions[idx].groupName;
    }
  }



  /**
   * ##################################################################
   * Loading data (e.g., from customers/id) and updating form when data arrives.
   *
   * Note: @ViewChild dynFormComponent (needed in updateForm()) is not set before AfterViewInit!
   * But it can be done here because customer$.subscribe() takes time.
   * ##################################################################
   */
  ngOnInit() {

    if (this.route) {
      this.customer$ = this.route.paramMap.pipe(
        switchMap((params: ParamMap) =>
          this.customerService.getCustomer(+params.get('id'))));

      this.customer$.subscribe(
        res => {
          console.log('##################' + JSON.stringify(res));
          this.customer = res;

          /** Error handler service (in customer service) returns {} in case of an error (e.g. if customer not found).
           * So we need to check if the customer is defined, not null, *and* not {}. */

          if (this.customer && this.customer.name) {

            this.updateForm();


            /** Build the static customer form */
            this.buildForm();
          }

        }); // End of subscribing customer
    }

  } // End of ngOnInit()


  // ngAfterViewInit() { }


  /**
   * ##################################################################
   * Update form and add formArray (if exists) in questions.
   * ##################################################################
   */
  updateForm() {

    /** Update empty form /Set (patch) values /Render the dynamic customer form */
    this.dynFormComponent.setFormValue(this.customer);


    // Analog to DynamicFormQuestionComponent!
    this.customerQuestions.forEach(question => {
      if (question.controlType === 'formArray' && this.customer[question.name]) {

        if (this.customer[question.name].length > 0) { // e.g. addAddresses

          const l = this.customer[question.name].length;
          for (let i = 0; i < l; i++) {

            /** Creating a FormGroup from the given *nested* questions. */
            const formGroup = this.formGroupService.createFormGroup(question.nestedQuestions);

            /** Adding this new FormGroup to the FormArray. */
            const formArray = this.dynFormComponent.form.get(question.name) as FormArray;
            formArray.push(formGroup);

          }

          // TODO update only address fields?
          /** Render the dynamic customer form */
          this.dynFormComponent.setFormValue(this.customer);


        }

      }
    });

  }



  /** Two update variants: */

  /**
   * ##################################################################
   * 1. Customer form commit. TO DO Create or update customer.
   * onDynamicFormSubmit
   * ##################################################################
   */
  onCustomerFormSubmit(value) {


    // this.updateCustomer(value); // fires too often (to be used for update)!

    // this.updateCustomer(this.customer);

    // this.customerFormValue = value;
    // this.selectedFilterTemplate = value;
    // this.loadCustomers();
  }


  /**
   * ##################################################################
   *2. SaveDyn button. TO DO Create or update customer.
   * ##################################################################
   */
  saveDyn() {
    // this.updateCustomer(value);
    this.updateCustomer(this.dynFormComponent.form.value);

  }



  /**
   * ##################################################################
   * OLD Build form (static version).
   * ##################################################################
   */
  buildForm() {
    this.title = this.customer.id ? 'Update Customer' : 'Create Customer';

    this.customerForm = this.formBuilder.group({
      id: [this.customer.id],
      name: [this.customer.name, Validators.required],
      type: [this.customer.type.toString(), Validators.required],
      status: [this.customer.status.toString(), Validators.required],
      // Addresses
      country: [this.customer.country, Validators.required],
      postalCode: [this.customer.postalCode, Validators.required],
      city: [this.customer.city, Validators.required],
      street: [this.customer.street, Validators.required],
      // Contacts
      department: [this.customer.department],
      person: [this.customer.person],
      phone: [this.customer.phone, Validators.required],
      email: [this.customer.email, [Validators.required, Validators.email]]
    });
    // this.customer.dob = this.typesUtilsService.getDateFromString(this.customer.dateOfBbirth);
  }

  /** UI */
  // getTitle(): string {
  //   return this.customer.id ? "Update Customer" : "Create Customer";

  // if (this.customer.id > 0) {
  //   return `Update Customer: ${this.customer.id} / ${this.customer.name}` ;
  // }
  // return "Create Customer";
  // }

  // isControlInvalid(controlName: string): boolean {
  //   const control = this.customerForm.controls[controlName];
  //   const result = control.invalid && control.touched;
  //   return result;
  // }

  /** ACTIONS */
  prepareCustomer(): Customer {
    const controls = this.customerForm.controls;
    const preparedCustomer = new Customer();

    preparedCustomer.id = this.customer.id;
    preparedCustomer.name = controls['name'].value;
    preparedCustomer.type = +controls['type'].value;
    preparedCustomer.status = +controls['status'].value;
    // Addresses
    preparedCustomer.country = controls['country'].value;
    preparedCustomer.postalCode = controls['postalCode'].value;
    preparedCustomer.city = controls['city'].value;
    preparedCustomer.street = controls['street'].value;
    // Contacts
    preparedCustomer.department = controls['department'].value;
    preparedCustomer.person = controls['person'].value;
    preparedCustomer.phone = controls['phone'].value;
    preparedCustomer.email = controls['email'].value;
    // console.log("preparedCustomer", preparedCustomer);

    return preparedCustomer;
  }

  save() {

    this.hasErrors = false;
    // this.loadingAfterSubmit = false;
    const controls = this.customerForm.controls;
    /** check form */
    if (this.customerForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.hasErrors = true;
      return;
    }

    const editedCustomer: Customer = this.prepareCustomer();

    if (editedCustomer.id > 0) {
      this.updateCustomer(editedCustomer);
    } else {
      this.createCustomer(editedCustomer);
    }
  }



  returnToList(customer?: Customer) {
    this.router.navigate(['/customers']);
    // this.router.navigate(['/customers', {id: customer.id}]);
    // this.router.navigate(['/customers', row.id]);
    // if (this.dialogRef) {
    //   this.dialogRef.close({
    //     customer,
    //     isEdit: true
    //   });
    // }
  }


  /**
   * ##################################################################
   * Update customer (delegating to customer service).
   * ##################################################################
   */
  updateCustomer(customer: Customer) {

    this.customerService.updateCustomer(customer)
      .subscribe(res => {
        this.returnToList(customer);
      });
  }


  /**
   * ##################################################################
   * Create new customer (delegating to customer service).
   * ##################################################################
   */
  createCustomer(customer: Customer) {

    this.customerService.createCustomer(customer)
      .subscribe(res => {
        this.returnToList(customer);
      });
  }



  onAlertClose($event) {
    this.hasErrors = false;
  }
}




/**
 * ####################################################################
 * CustomerDetailDialogComponent
 * ####################################################################
 *   Called from CustomerListComponent via:
 *     dialog.open(CustomerDetailDialogComponent, dialogConfig);
 *     and dialogConfig.data = { customer }
 * ####################################################################
 */
export class CustomerDetailDialogComponent extends CustomerDetailComponent implements OnInit, AfterViewInit {

  // /** Reference to the dynamic form component */
  // @ViewChild(DynamicFormComponent)
  // dynFormComponent: DynamicFormComponent;


  constructor(
    public dialogRef: MatDialogRef<CustomerDetailDialogComponent>,
    // data object from open.dialog(): data = { customer }
    @Inject(MAT_DIALOG_DATA) public data: any,

    formBuilder: FormBuilder,

    router: Router,
    route: ActivatedRoute,
    customerService: HttpCustomerService,
    httpErrorHandler: HttpErrorHandler,
    typesUtilsService: TypesUtilsService,
    formGroupService: DynamicFormGroupService,
  ) {
    super(formBuilder, router, route, customerService, httpErrorHandler, typesUtilsService, formGroupService);
    // this.isDialogComponent = true;
  }


  ngOnInit() { }


  ngAfterViewInit() {

    this.customer = this.data.customer;

    // @ViewChild dynFormComponent not set before AfterViewInit!
    this.updateForm();

    this.buildForm();
  }


  returnToList(customer?: Customer) {
    this.dialogRef.close({
      customer,
      isEdit: true
    });

  }
}
