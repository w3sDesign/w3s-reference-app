import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

// https://angular.io/guide/router#lazy-loading-route-configuration


const appRoutes: Routes = [

  // Importing (loading) feature modules dynamically (lazyly).
  {
    path: 'customers',
    loadChildren: () => import('./customer/customer.module')
      .then(mod => mod.CustomerModule),

    // err can't find module CustomerModule!!?
    // loadChildren: './customer/customer.module#CustomerModule'
    // loadChildren: '../src/app/customer/customer.module#CustomerModule'
    // loadChildren: () => CustomerModule
  },
  {
    path: 'products',
    loadChildren: () => import('./product/product.module')
      .then(mod => mod.ProductModule),
  },


  {
    path: 'home', component: HomeComponent
  },

  // { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  {
    // path: '**', component: HomeComponent
    path: '**', component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    appRoutes, {
      enableTracing: true,
      // Preloading all lazy loaded modules.
      preloadingStrategy: PreloadAllModules
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
