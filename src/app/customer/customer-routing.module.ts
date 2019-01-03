import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerRootComponent } from './customer-root/customer-root.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerRootComponent,
    children: [
      {
        path: '',
        component: CustomerListComponent
        // children: [
        //   {
        //     path: ':id',
        //     component: CustomerDetailComponent
        //   },
        //   {
        //     path: '',
        //     component: CustomerHomeComponent
        //   }
        // ]
      },
      {
        path: ':id',
        component: CustomerDetailComponent
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
