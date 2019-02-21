import { NgModule } from '@angular/core';

// CommonModule instead of BrowserModule
// (BrowserModule only in the root AppModule).
import { CommonModule } from '@angular/common';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { CustomerInMemoryDataService } from './model/customer-in-memory-data.service';
import { environment } from '../../environments/environment';

import { CustomerRootComponent } from './customer-root/customer-root.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailComponent, CustomerDetailDialogComponent } from './customer-detail/customer-detail.component';
import { HttpCustomerService } from './model/http-customer.service';
import { CustomerRoutingModule } from './customer-routing.module';

// import { HttpUtilsService } from '../common/http-utils.service';
// import { TypesUtilsService } from '../common/types-utils.service';

import { SharedMaterialModule } from '../shared/shared-material.module';

// import { MatSnackBarModule } from '@angular/material';

// import { MatSnackBarContainer } from '@angular/material';

import { DynamicFormComponent } from '../shared/dynamic-form/dynamic-form.component';
import { DynamicFieldComponent } from '../shared/dynamic-form/dynamic-field.component';

import { HighlightDirective } from '../shared/directives/highlight.directive';

import { DynamicFilterFieldService } from './dynamic-form/dynamic-filter-field.service';
import { FilterDetailComponent } from './filter-detail/filter-detail.component';


@NgModule({
  imports: [
    CommonModule,
    // BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    SharedMaterialModule,
    // MatSnackBarModule,
    CustomerRoutingModule,

    HttpClientModule,
    //  The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    //  and returns simulated server responses.
    //  Remove it when a real server is ready to receive requests.
    environment.production
      ? []
      : HttpClientInMemoryWebApiModule
        .forFeature(CustomerInMemoryDataService, {
          delay: 350,
          dataEncapsulation: false
        }),
  ],
  declarations: [
    CustomerRootComponent,
    CustomerListComponent,
    CustomerDetailComponent,
    CustomerDetailDialogComponent,

    DynamicFormComponent,
    DynamicFieldComponent,
    HighlightDirective,
    FilterDetailComponent,
  ],
  entryComponents: [
    CustomerDetailDialogComponent,
    // MatSnackBarContainer
  ],
  providers: [
    HttpCustomerService,
    DynamicFilterFieldService,
    CustomerInMemoryDataService,
  ],
  exports: [
    // CustomerListComponent,
    // CustomerDetailComponent,
    // CustomerDetailDialogComponent,
  ]
})
export class CustomerModule { }
