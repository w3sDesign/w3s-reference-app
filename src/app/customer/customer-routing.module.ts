import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerRootComponent } from './customer-root/customer-root.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { FilterDetailComponent } from './filter-detail/filter-detail.component';

const customerRoutes: Routes = [
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
        path: 'filters',
        component: FilterDetailComponent
      },
      {
        path: ':id',
        component: CustomerDetailComponent
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(customerRoutes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
