import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FilterTemplateRootComponent } from './filter-template-root/filter-template-root.component';
import { FilterTemplateDetailComponent } from './filter-template-detail/filter-template-detail.component';
import { FilterTemplateListComponent } from './filter-template-list/filter-template-list.component';

const filterTemplateRoutes: Routes = [
  {
    path: '',
    component: FilterTemplateRootComponent,
    children: [
      {
        path: '',
        component: FilterTemplateListComponent
        // children: [
        //   {
        //     path: ':id',
        //     component: FilterTemplateDetailComponent
        //   },
        //   {
        //     path: '',
        //     component: FilterTemplateHomeComponent
        //   }
        // ]
      },
      // {
      //   path: 'filter-templates',
      //   component: FilterTemplateListComponent
      // },
      // {
      //   path: 'templates',
      //   component: FilterTemplateDetailComponent
      // },
      // {
      //   path: 'filters',
      //   component: FilterDetailComponent
      // },
      {
        path: ':id',
        component: FilterTemplateDetailComponent
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(filterTemplateRoutes)],
  exports: [RouterModule]
})
export class FilterTemplateRoutingModule { }
