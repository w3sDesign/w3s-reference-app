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

import { CustomerService } from '../model/customer.service';
// import { HttpCustomerService } from '../model/http-customer.service';
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
import { MessageService } from '../../shared/message.service';


// changeDetection: ChangeDetectionStrategy.OnPush
@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit, AfterViewInit {

  showTestValues = true;

  // customer: Customer | Observable<Customer>;
  customer$: Observable<Customer>;
  customer: Customer;

  // customerForm: FormGroup; // = static form
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
  @ViewChild('customerForm')
  customerForm: DynamicFormComponent;
  customerFormHasChanged = false;

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

  // customerFormValue: any = {};

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
    private customerService: CustomerService,
    private httpErrorHandler: HttpErrorHandler,
    private typesUtilsService: TypesUtilsService,
    private formGroupService: DynamicFormGroupService,
    private messageService: MessageService,
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
   * Loading data (from customers/id) and updating form when data arrives.
   *
   * Note: @ViewChild customerForm (needed in updateCustomerForm()) is not set before AfterViewInit!
   * But it can be done here because customer$.subscribe() takes time.
   * ##################################################################
   */
  ngOnInit() {

    this.logMessage(
      `(1)[ngOnInit()] this.route = \n ${this.route}`
    );

    if (this.route) {
      this.customer$ = this.route.paramMap.pipe(
        switchMap((params: ParamMap) =>
          this.customerService.getCustomer(+params.get('id')))
      );

      this.customer$.subscribe(
        res => {

          this.logMessage(
            `(2)[ngOnInit()] customer = \n ${JSON.stringify(res)}`
          );

          this.customer = res;

          /** Error handler service (in customer service) returns {}
           * in case of an error (e.g. if customer not found).
           * So we need to check if the customer is defined, not null;
           * and not {} by checking customer.name.
           */
          if (this.customer && this.customer.name) {

            this.updateCustomerForm(this.customer);
          }

        });
    }

  }


  ngAfterViewInit() {
    this.customerForm.form.valueChanges.subscribe(val => {

      this.customerFormHasChanged = true;

    });

  }


  /**
   * ##################################################################
   * Update form and add formArray.
   * ##################################################################
   */
  updateCustomerForm(customer: Customer) {

    this.customerForm.form.patchValue(customer);

    // Adding the formArray that corresponds to the given customer
    // (analog to DynamicFormQuestionComponent).
    this.customerQuestions.forEach(question => {
      if (question.controlType === 'formArray' && customer[question.name]) {

        if (customer[question.name].length > 0) {
          const l = customer[question.name].length; // e.g. number of add. addresses
          for (let i = 0; i < l; i++) {

            /** Creating a FormGroup from the given *nested* questions. */
            const formGroup = this.formGroupService.createFormGroup(question.nestedQuestions);

            /** Adding this new FormGroup to the FormArray. */
            const formArray = this.customerForm.form.get(question.name) as FormArray;
            formArray.push(formGroup);

          }
          this.customerForm.form.patchValue(customer);
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
  onCustomerFormSubmit() {

    // this.updateCustomer(this.customerForm.form.value);


    // this.updateCustomer(this.customer);

  }


  /**
   * ##################################################################
   *2. SaveDyn button. TO DO Create or update customer.
   * ##################################################################
   */
  // saveDyn() {
  //   this.updateCustomer(this.customerForm.form.value);

  // }



  /**
   * ##################################################################
   * OLD Build form (static version).
   * ##################################################################
   */
  // buildForm() {
  //   this.title = this.customer.id ? 'Update Customer' : 'Create Customer';

  //   this.customerForm = this.formBuilder.group({
  //     id: [this.customer.id],
  //     name: [this.customer.name, Validators.required],
  //     type: [this.customer.type.toString(), Validators.required],
  //     status: [this.customer.status.toString(), Validators.required],
  //     // Addresses
  //     country: [this.customer.country, Validators.required],
  //     postalCode: [this.customer.postalCode, Validators.required],
  //     city: [this.customer.city, Validators.required],
  //     street: [this.customer.street, Validators.required],
  //     // Contacts
  //     department: [this.customer.department],
  //     person: [this.customer.person],
  //     phone: [this.customer.phone, Validators.required],
  //     email: [this.customer.email, [Validators.required, Validators.email]]
  //   });
  //   // this.customer.dob = this.typesUtilsService.getDateFromString(this.customer.dateOfBbirth);
  // }

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
    preparedCustomer.type = controls['type'].value;
    preparedCustomer.status = controls['status'].value;
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
    const controls = this.customerForm.form.controls;
    /** check form */
    if (this.customerForm.form.invalid) {
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





  /** Logging message to console. */
  private logMessage(message: string) {
    return this.messageService.logMessage('[customer-detail.component.ts] ' + message);
  }

  /** Showing a user friendly message. */
  private showMessage(message: string) {
    return this.messageService.showMessage('*** ' + message + ' ***');
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
    customerService: CustomerService,
    httpErrorHandler: HttpErrorHandler,
    typesUtilsService: TypesUtilsService,
    formGroupService: DynamicFormGroupService,
    messageService: MessageService,
  ) {
    super(formBuilder, router, route, customerService, httpErrorHandler, typesUtilsService, formGroupService, messageService);
    // this.isDialogComponent = true;
  }


  ngOnInit() { }


  ngAfterViewInit() {

    this.customer = this.data.customer;

    // @ViewChild customerForm not set before AfterViewInit!
    this.updateCustomerForm(this.customer);

    // this.buildForm();
  }


  returnToList(customer?: Customer) {
    this.dialogRef.close({
      customer,
      isEdit: true
    });

  }
}
