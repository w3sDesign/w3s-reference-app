import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { CustomerModule } from './customer/customer.module';


const routes: Routes = [
  {
    path: 'customers',
    // err can't find module CustomerModule!!?
    // loadChildren: './customer/customer.module#CustomerModule'
    // loadChildren: '../src/app/customer/customer.module#CustomerModule'

    loadChildren: () => CustomerModule
  },
  {
    path: 'filter-templates',
    loadChildren: './filter-template/filter-template.module#FilterTemplateModule'
  },
  {
    path: '', component: HomeComponent
  },
  {
    path: 'home', redirectTo: '', pathMatch: 'full'
  },
  {
    path: '**', component: HomeComponent
    // { path: '**', component: PageNotFoundComponent }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      enableTracing: true,
      preloadingStrategy: PreloadAllModules
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
