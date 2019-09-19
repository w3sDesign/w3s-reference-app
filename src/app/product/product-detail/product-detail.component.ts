/**
 * ProductDetailComponent
 * and
 * ProductDetailDialogComponent extends ProductDetailComponent.
 */
import {
  Component, OnInit, Inject, ElementRef, ViewChild, ChangeDetectionStrategy, AfterViewInit
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ProductService } from '../model/product.service';
// import { HttpProductService } from '../model/http-product.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';

import { TypesUtilsService } from '../../shared/types-utils.service';
import { Product } from '../model/product';
import { countries } from '../../shared/countries';

import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../shared/dynamic-form/question-base';
import { mockProductQuestions } from '../model/mock-product-questions';
import { DynamicFormGroupService } from '../../shared/dynamic-form/dynamic-form-group.service';
import { DynamicFormOptions } from '../../shared/dynamic-form/dynamic-form-options';
// import { questionsConfig } from '../model/product.config';
import { MessageService } from '../../shared/message.service';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';

import * as moment from 'moment';



// changeDetection: ChangeDetectionStrategy.OnPush
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})

/**
 * Reusable detail component for creating and updating products.
 * ####################################################################
 * Communicates with other components (the main List component)
 * via router navigation.
 */

export class ProductDetailComponent implements OnInit, AfterViewInit {

  showTestValues = true;

  // product: Product | Observable<Product>;
  product$: Observable<Product>;
  product: Product;

  // productForm: FormGroup; // = static form
  // hasErrors = false;
  // hasChanged = false;

  title: string;

  // loadingAfterSubmit: boolean = false;
  // @ViewChild("nameInput") nameInput: ElementRef;

  countries: any[] = countries;

  // dialogRef: MatDialogRef<ProductDetailDialogComponent>;
  matDialogData: any;


  /** Reference to the dynamic form component */
  // Not set before AfterViewInit.
  @ViewChild('productForm', { static: false })
  productForm: DynamicFormComponent;

  /** Questions for generating the dynamic form. */
  // TODO? Loading from server must be before app! APP-INITIALIZE?
  productQuestions: QuestionBase[] = mockProductQuestions;

  /** Data group names (e.g. 'Basic Data', 'Addresses'). */
  dataGroupNames: string[] = [];



  // Compare <w3s-dynamic-form [ngClass]="productFormClass"
  // productFormClass: any = {
  //   'flex-box': true,
  // };


  /** Filter templates */
  // products: Product[]; // mockProductFilterTemplates;

  // productFormValue: any = {};

  productFormOptions: DynamicFormOptions = {
    formFieldAppearance: 'fill'
  };


  routeIds: string;
  routeDisplayedColumns: string;
  routeQueryParams: string;

  // test MatDatepicker
  date: FormControl;

  // Component constructor.
  // ##################################################################

  constructor(
    // public dialogRef: MatDialogRef<ProductDetailDialogComponent>,
    // data object from open.dialog(): data = { product }
    // @Inject(MAT_DIALOG_DATA) public matDialogData: any,

    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private httpErrorHandler: HttpErrorHandler,
    private typesUtilsService: TypesUtilsService,
    private formGroupService: DynamicFormGroupService,
    private messageService: MessageService,
  ) {
    /** Setting data group names. */
    for (let i = 0; i < 100; i++) {
      const idx = this.productQuestions.findIndex(question => question.group === i + 1);
      if (idx === -1) { break; }
      this.dataGroupNames[i] = this.productQuestions[idx].groupName;
    }
  }


  // Component lifecycle hook.
  // ##################################################################
  // Called once after creating the component,
  // but before creating child components.

  //  @ViewChild productForm not set before AfterViewInit!

  ngOnInit() {

    this.logMessage(`[ngOnInit()] ########################################`);

    this.logMessage(
      `(1)[ngOnInit()] this.route = \n ${this.route}`
    );

    // Loading product data.
    // Updating form must be done in ngAfterViewInit.

    // Getting product id from activated route.
    this.product$ = this.route.paramMap.pipe(
      switchMap((routeParams: ParamMap) => {

        // Needed in navigateToList().
        this.routeIds = routeParams.get('ids');
        this.routeDisplayedColumns = routeParams.get('displayedColumns');
        this.routeQueryParams = routeParams.get('queryParams');

        if (+routeParams.get('id') === 0) {
          this.title = 'Create Product';
          return of(new Product());
          ///////////////////////////////////////////////////////////////

        } else {

          this.title = 'Update Product';
          return this.productService.getProduct(+routeParams.get('id'));
          ///////////////////////////////////////////////////////////////

        }

      })
    );


    this.product$.subscribe(
      res => {
        this.product = res;

        // Error handler service (in product service) returns {} in case
        // of an error (e.g. if the product is not found).
        // So we need to check if the product is defined, not null;
        // and not {} by checking the product.id.

        // if (this.product && this.product.id >= 0) {
        if (this.product && this.product.id > 0) {

          // Updating form

          this.logMessage(
            `1[ngOnInit()] this.product = \n ${JSON.stringify(this.product)}`
          );

          setTimeout(() => {

            this.logMessage(
              `2[ngOnInit()] this.product = \n ${JSON.stringify(this.product)}`
            );

            const cd = this.productForm.form.get('creationDate');

            // cd.disable({ emitEvent: false });

            // Update form (?except creationDate).
            this.productForm.form.patchValue(this.product);

            // cd.enable({ emitEvent: false });
            // cd.markAsPristine();

            // Set creation date with a moment (needed by matDatepicker).
            // strict mode true/false
            cd.setValue(moment(this.product.creationDate, ['YYYY-MM-DD', 'DD/MM/YYYY'], false));

            this.addFormArrays(this.product);

          });
        }


      });


  }


  // Component lifecycle hook.
  // ##################################################################
  // Called once after creating the child components.

  ngAfterViewInit() {

    this.logMessage(`[ngAfterViewInit()] ========================================`);

    // this.productForm.form.valueChanges.subscribe(val => {
    //   this.productFormHasChanged = true;
    // });






  }


  // ##################################################################
  // Component public member methods (in alphabetical order).
  // ##################################################################


  /**
   * Adding formArrays if existent (like additional addresses/contacts).
   * ##################################################################
   * (analog to DynamicFormQuestionComponent).
   */

  addFormArrays(product: Product) {

    this.productQuestions.forEach(question => {
      if (question.controlType === 'formArray' && product[question.name]) {

        const l = product[question.name].length;
        if (l > 0) {
          for (let i = 0; i < l; i++) {

            // Creating a FormGroup for each *nested* question.
            const formGroup = this.formGroupService.createFormGroup(question.nestedQuestions);

            // Adding this new FormGroup to the FormArray.
            const formArray = this.productForm.form.get(question.name) as FormArray;
            formArray.push(formGroup);

          }
          const cd = this.productForm.form.get('creationDate');

          // cd.disable({ emitEvent: false });

          // Update form (?except creationDate).
          this.productForm.form.patchValue(this.product);

          // cd.enable({ emitEvent: false });
          // cd.markAsPristine();

          // Set creation date with a moment (needed by matDatepicker).
          // strict mode true/false
          cd.setValue(moment(this.product.creationDate, ['YYYY-MM-DD', 'DD/MM/YYYY'], false));


          // this.productForm.form.patchValue(product);
        }

      }
    });

  }


  /**
   * Creating a new product (delegating to product service).
   * ##################################################################
   */

  createProduct() {

    const product: Product = this.productForm.form.getRawValue();

    const cd = this.productForm.form.get('creationDate');
    // cd.value is a moment
    product.creationDate = cd.value.format('YYYY-MM-DD');

    this.productService.createProduct(product)
      .subscribe(res => {
        this.navigateToList(product);
      });

  }



  /**
   * Navigating back to the ProductListComponent.
   * ##################################################################
   *  https://angular.io/guide/router#navigating-back-to-the-list-component
   */

  navigateToList(product?: Product) {

    this.router.navigate(['/products', {
      id: product ? product.id : null,
      ids: this.routeIds,
      displayedColumns: this.routeDisplayedColumns,
      queryParams: this.routeQueryParams,
    }]);

  }


  // onAlertClose($event) {
  //   this.hasErrors = false;
  // }



  /** Two update variants: */

  /**
   * 1. Product form commit. TO DO Create or update product.
   * onDynamicFormSubmit
   * ##################################################################
   */

  onProductFormSubmit() {

    // this.updateProduct(this.productForm.form.value);


    // this.updateProduct(this.product);

  }


  /**
   * 2. SaveDyn button. TO DO Create or update product.
   * ##################################################################
   */
  // saveDyn() {
  //   this.updateProduct(this.productForm.form.value);

  // }



  /**
   * OLD Build form (static version).
   * ##################################################################
   */
  // buildForm() {
  //   this.title = this.product.id ? 'Update Product' : 'Create Product';

  //   this.productForm = this.formBuilder.group({
  //     id: [this.product.id],
  //     name: [this.product.name, Validators.required],
  //     type: [this.product.type.toString(), Validators.required],
  //     status: [this.product.status.toString(), Validators.required],
  //     // Addresses
  //     country: [this.product.country, Validators.required],
  //     postalCode: [this.product.postalCode, Validators.required],
  //     city: [this.product.city, Validators.required],
  //     street: [this.product.street, Validators.required],
  //     // Contacts
  //     department: [this.product.department],
  //     person: [this.product.person],
  //     phone: [this.product.phone, Validators.required],
  //     email: [this.product.email, [Validators.required, Validators.email]]
  //   });
  //   // this.product.dob = this.typesUtilsService.getDateFromString(this.product.dateOfBbirth);
  // }

  /** UI */
  // getTitle(): string {
  //   return this.product.id ? "Update Product" : "Create Product";

  // if (this.product.id > 0) {
  //   return `Update Product: ${this.product.id} / ${this.product.name}` ;
  // }
  // return "Create Product";
  // }

  // isControlInvalid(controlName: string): boolean {
  //   const control = this.productForm.controls[controlName];
  //   const result = control.invalid && control.touched;
  //   return result;
  // }

  /** ACTIONS */
  prepareProduct(): Product {
    const controls = this.productForm.controls;
    const preparedProduct = new Product();

    preparedProduct.id = this.product.id;
    preparedProduct.name = controls['name'].value;
    preparedProduct.type = controls['type'].value;
    preparedProduct.status = controls['status'].value;
    // Addresses
    preparedProduct.country = controls['country'].value;
    preparedProduct.postalCode = controls['postalCode'].value;
    preparedProduct.city = controls['city'].value;
    preparedProduct.street = controls['street'].value;
    // Contacts
    preparedProduct.department = controls['department'].value;
    preparedProduct.person = controls['person'].value;
    preparedProduct.phone = controls['phone'].value;
    preparedProduct.email = controls['email'].value;
    // console.log("preparedProduct", preparedProduct);

    return preparedProduct;
  }

  // save() {

  //   this.hasErrors = false;
  //   // this.loadingAfterSubmit = false;
  //   const controls = this.productForm.form.controls;
  //   /** check form */
  //   if (this.productForm.form.invalid) {
  //     Object.keys(controls).forEach(controlName =>
  //       controls[controlName].markAsTouched()
  //     );
  //     this.hasErrors = true;
  //     return;
  //   }

  //   const editedProduct: Product = this.prepareProduct();

  //   if (editedProduct.id > 0) {
  //     this.updateProduct(editedProduct);
  //   } else {
  //     this.createProduct(editedProduct);
  //   }
  // }


  /**
   * Update product (delegating to product service).
   * ##################################################################
   */

  updateProduct() {

    const product: Product = this.productForm.form.getRawValue();

    const cd = this.productForm.form.get('creationDate');
    // cd.value is a moment
    product.creationDate = cd.value.format('YYYY-MM-DD');


    this.productService.updateProduct(product)
      .subscribe(res => {

        this.logMessage(
          `1[updateProduct()] product = \n ${JSON.stringify(product)}`
        );

        this.navigateToList(product);
      });
  }




  // ##################################################################
  // Component non public member methods.
  // ##################################################################


  /** Logging message to console. */
  private logMessage(message: string) {
    return this.messageService.logMessage('[product-detail.component.ts] ' + message);
  }

  /** Showing a user friendly message. */
  private showMessage(message: string) {
    return this.messageService.showMessage('*** ' + message + ' ***');
  }

}




/**
 * ####################################################################
 * ProductDetailDialogComponent
 * ####################################################################
 *   Called from ProductListComponent via:
 *     dialog.open(ProductDetailDialogComponent, dialogConfig);
 *     and dialogConfig.data = { product }
 * ####################################################################
 */
export class ProductDetailDialogComponent extends ProductDetailComponent implements OnInit, AfterViewInit {

  // /** Reference to the dynamic form component */
  // @ViewChild(DynamicFormComponent)
  // dynFormComponent: DynamicFormComponent;


  constructor(
    public dialogRef: MatDialogRef<ProductDetailDialogComponent>,
    // data object from open.dialog(): data = { product }
    @Inject(MAT_DIALOG_DATA) public matDialogData: any,

    formBuilder: FormBuilder,

    router: Router,
    route: ActivatedRoute,
    productService: ProductService,
    httpErrorHandler: HttpErrorHandler,
    typesUtilsService: TypesUtilsService,
    formGroupService: DynamicFormGroupService,
    messageService: MessageService,
  ) {
    super(formBuilder, router, route, productService, httpErrorHandler, typesUtilsService, formGroupService, messageService);
    // this.isDialogComponent = true;
  }


  ngOnInit() { }


  ngAfterViewInit() {

    this.product = this.matDialogData.product;


    // @ViewChild productForm not set before AfterViewInit!
    this.productForm.form.patchValue(this.product);

    this.addFormArrays(this.product);

  }


  navigateToList(product?: Product) {

    this.dialogRef.close({
      product,
      isEdit: true
    });

  }
}
