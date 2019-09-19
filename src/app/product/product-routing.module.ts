import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductRootComponent } from './product-root/product-root.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';


// See https://angular.io/guide/router#milestone-3-heroes-feature

const productRoutes: Routes = [

  { path: ':id', component: ProductDetailComponent },
  { path: '', component: ProductListComponent },

];

@NgModule({
  imports: [RouterModule.forChild(productRoutes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }




 // {
  //   path: '',
  //   // component: ProductRootComponent,
  //   component: ProductListComponent,
  //   children: [
  //     {
  //       path: '',
  //       component: ProductListComponent,
  //       children: [
  //         {
  //           path: ':id',
  //           component: ProductDetailComponent
  //         },
  //         // {
  //         //   path: '',
  //         //   component: ProductHomeComponent
  //         // }
  //       ]
  //     },
  //     {
  //       path: ':id',
  //       component: ProductDetailComponent
  //     },
  //   ]
  // }


