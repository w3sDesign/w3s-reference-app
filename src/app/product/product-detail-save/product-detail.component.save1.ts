/**
 * ProductDetailComponent
 * and
 * ProductDetailDialogComponent extends ProductDetailComponent.
 */
import {
  Component, OnInit, Inject, ElementRef, ViewChild, ChangeDetectionStrategy
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HttpProductService } from '../model/http-product.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';

import { TypesUtilsService } from '../../shared/types-utils.service';
import { Product } from '../model/product';
import { countries } from '../../shared/countries';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

// changeDetection: ChangeDetectionStrategy.OnPush
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  // product: Product | Observable<Product>;
  product$: Observable<Product>;
  product: Product;

  productForm: FormGroup;
  hasErrors = false;
  isLoading = false;
  title = '';

  // loadingAfterSubmit: boolean = false;
  // @ViewChild("nameInput") nameInput: ElementRef;

  countries: any[] = countries;

  // dialogRef: MatDialogRef<ProductDetailDialogComponent>;
  data: any;

  constructor(
    // public dialogRef: MatDialogRef<ProductDetailDialogComponent>,
    // data object from open.dialog(): data = { product }
    // @Inject(MAT_DIALOG_DATA) public data: any,

    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private productService: HttpProductService,
    private httpErrorHandler: HttpErrorHandler,
    private typesUtilsService: TypesUtilsService
  ) {
    // this.isDialogComponent = false;
  }

  /** LOAD DATA */
  ngOnInit() {
    // if (this.isDialogComponent) {
    //   this.product = this.data.product;
    //   this.buildForm();
    // } else {

    // this.route.paramMap.pipe(
    //   switchMap((params: ParamMap) =>
    //     this.productService.getProduct(+params.get('id'))),
    //   tap(res => this.product = res),
    //   tap(res => console.log(res)),
    //   tap(() => this.buildForm())
    // )
    //   .subscribe(x => console.log(x));

    if (this.route) {
      this.product$ = this.route.paramMap.pipe(
        switchMap((params: ParamMap) =>
          this.productService.getProduct(+params.get('id'))));

      this.product$.subscribe(
        res => {
          // console.log(res);
          this.product = res;
          this.buildForm();
        }
      );
    }

    //   // /* Server loading imitation. Remove this on real code */
    //   // this.isLoading = true;
    //   // setTimeout(() => {
    //   //   this.isLoading = false;
    //   // }, 500);
  }


  buildForm() {
    this.title = this.product.id ? 'Update Product' : 'Create Product';

    this.productForm = this.formBuilder.group({
      id: [this.product.id],
      name: [this.product.name, Validators.required],
      type: [this.product.type.toString(), Validators.required],
      status: [this.product.status.toString(), Validators.required],
      // Addresses
      country: [this.product.country, Validators.required],
      postalCode: [this.product.postalCode, Validators.required],
      city: [this.product.city, Validators.required],
      street: [this.product.street, Validators.required],
      // Contacts
      department: [this.product.department],
      person: [this.product.person],
      phone: [this.product.phone, Validators.required],
      email: [this.product.email, [Validators.required, Validators.email]]
    });
    // this.product.dob = this.typesUtilsService.getDateFromString(this.product.dateOfBbirth);
  }

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
    preparedProduct.type = +controls['type'].value;
    preparedProduct.status = +controls['status'].value;
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

  save() {

    this.hasErrors = false;
    // this.loadingAfterSubmit = false;
    const controls = this.productForm.controls;
    /** check form */
    if (this.productForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.hasErrors = true;
      return;
    }

    const editedProduct = this.prepareProduct();

    if (editedProduct.id > 0) {
      this.updateProduct(editedProduct);
    } else {
      this.createProduct(editedProduct);
    }
  }



  returnToList(product?: Product) {
    this.router.navigate(['/products']);
    // this.router.navigate(['/products', {id: product.id}]);
    // this.router.navigate(['/products', row.id]);
    // if (this.dialogRef) {
    //   this.dialogRef.close({
    //     product,
    //     isEdit: true
    //   });
    // }
  }

  /**
   * Update product (delegating to product service).
   * @param product
   */
  updateProduct(product: Product) {
    // this.loadingAfterSubmit = true;
    this.isLoading = true;

    this.productService.updateProduct(product)
      .subscribe(res => {
        /* Server loading imitation. Remove this on real code */
        this.isLoading = false;
        this.returnToList(product);
      });
  }

  /**
   * Create new Product (delegating to product service).
   * @param product
   */
  createProduct(product: Product) {
    // this.loadingAfterSubmit = true;
    this.isLoading = true;

    this.productService.createProduct(product)
      .subscribe(res => {
        this.isLoading = false;
        this.returnToList(product);
      });
  }

  onAlertClose($event) {
    this.hasErrors = false;
  }
}




/**
 * Called from ProductListComponent via:
 * dialog.open(ProductDetailDialogComponent, dialogConfig);
 * and dialogConfig.data = { product }
 */
export class ProductDetailDialogComponent extends ProductDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProductDetailDialogComponent>,
    // data object from open.dialog(): data = { product }
    @Inject(MAT_DIALOG_DATA) public data: any,

    formBuilder: FormBuilder,

    router: Router,
    route: ActivatedRoute,
    productService: HttpProductService,
    httpErrorHandler: HttpErrorHandler,
    typesUtilsService: TypesUtilsService
  ) {
    super(formBuilder, router, route, productService, httpErrorHandler, typesUtilsService);
    // this.isDialogComponent = true;
  }

  ngOnInit() {
    this.product = this.data.product;
    this.buildForm();
  }

  returnToList(product?: Product) {
    this.dialogRef.close({
      product,
      isEdit: true
    });

  }
}
