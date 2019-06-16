import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { CustomerModule } from './customer/customer.module';

// https://angular.io/guide/router#lazy-loading-route-configuration


const routes: Routes = [

  // Customers not lazy loaded! Eager loaded with root app
  // {
  //   path: 'customers',
  //   loadChildren: () => import('./customer/customer.module')
  //     .then(mod => mod.CustomerModule),

  //   // err can't find module CustomerModule!!?
  //   // loadChildren: './customer/customer.module#CustomerModule'
  //   // loadChildren: '../src/app/customer/customer.module#CustomerModule'
  //   // loadChildren: () => CustomerModule
  // },


  // {
  //   path: 'home', component: HomeComponent
  // },

  { path: '', redirectTo: '/customers', pathMatch: 'full' },

  {
    path: '**', component: HomeComponent
    // { path: '**', component: PageNotFoundComponent }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes, {
      enableTracing: true,
      // Preload all lazy loaded modules.
      // preloadingStrategy: PreloadAllModules
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
