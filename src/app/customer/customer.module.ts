import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { SharedModule } from '../shared/shared.module';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { CustomerInMemoryDataService } from './model/customer-in-memory-data.service';
import { environment } from '../../environments/environment';

import { CustomerRootComponent } from './customer-root/customer-root.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import {
  CustomerDetailComponent,
  CustomerDetailDialogComponent
} from './customer-detail/customer-detail.component';
import { HttpCustomerService } from './model/http-customer.service';
import { CustomerFilterTemplateComponent } from './customer-filter-template/customer-filter-template.component';
// import { questionsConfig, customerConfig } from './model/nix.customer.config';


@NgModule({

  imports: [
    CommonModule,
    // FormsModule,
    // ReactiveFormsModule,
    // LayoutModule,
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
    CustomerRoutingModule,
    SharedModule,
  ],

  declarations: [
    CustomerRootComponent,
    CustomerListComponent,
    CustomerDetailComponent,
    CustomerDetailDialogComponent,
    CustomerFilterTemplateComponent,
  ],

  entryComponents: [
    CustomerDetailDialogComponent,
  ],

  providers: [
    HttpCustomerService,
    // {provide: CustomerService, useClass: HttpCustomerService},
    CustomerInMemoryDataService,
    // { provide: customerConfig, useValue: questionsConfig}
  ],

  exports: [
    // CustomerListComponent,
    // CustomerDetailComponent,
    // CustomerDetailDialogComponent,
  ]
})

export class CustomerModule { }
