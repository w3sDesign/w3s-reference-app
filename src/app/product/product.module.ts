import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { ProductRootComponent } from './product-root/product-root.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent, ProductDetailDialogComponent } from './product-detail/product-detail.component';
import { ProductFilterTemplateComponent } from './product-filter-template/product-filter-template.component';
import { ProductInMemoryDataService } from './model/product-in-memory-data.service';
import { ProductRoutingModule } from './product-routing.module';

import { ProductService } from './model/product.service';
import { HttpProductService } from './model/http-product.service';
import { MockProductService } from './model/mock-product.service';

import { ProductFilterTemplateService } from './model/product-filter-template.service';
import { HttpProductFilterTemplateService } from './model/http-product-filter-template.service';
// import { MockProductFilterTemplateService } from './model/http-product-filter-template.service';

// SharedModule includes (must include) SharedMaterialModule.
import { SharedModule } from '../shared/shared.module';

import { environment } from '../../environments/environment';


@NgModule({

  imports: [
    CommonModule,
    HttpClientModule,

    //  The HttpClientInMemoryWebApiModule module intercepts
    //  HTTP requests and returns simulated server responses.
    //  Remove it when a real server is ready to receive requests.
    environment.production
      ? []
      : HttpClientInMemoryWebApiModule
        .forFeature(ProductInMemoryDataService, {
          delay: 350,
          dataEncapsulation: false
        }),

    SharedModule,

    ProductRoutingModule,
  ],

  declarations: [
    ProductRootComponent,
    ProductListComponent,
    ProductDetailComponent,
    ProductDetailDialogComponent,
    ProductFilterTemplateComponent,
  ],

  entryComponents: [
    ProductDetailDialogComponent,
  ],

  providers: [

    // Choose the right implementation.
    // ################################################################
    // Application code refers to an interface and is independent of
    // an implementation. For example:
    //  ProductService is the interface (100% abstract class).
    //  HttpProductService and MockProductService are different implementations.

    { provide: ProductService, useClass: HttpProductService },

    // {provide: ProductService, useClass: MockProductService},

    { provide: ProductFilterTemplateService, useClass: HttpProductFilterTemplateService },

    // {provide: ProductFilterTemplateService, useClass: MockProductFilterTemplateService},

    ProductInMemoryDataService,
    // Is the same as:
    // {provide: ProductInMemoryDataService, useClass: ProductInMemoryDataService},

  ],

  exports: [
    // ProductListComponent,
    // ProductDetailComponent,
    // ProductDetailDialogComponent,
  ]
})

export class ProductModule { }
