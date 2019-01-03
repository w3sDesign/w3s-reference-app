import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './home/home.component';


const routes: Routes = [
 {
    path: 'customers',
    loadChildren: './customer/customer.module#CustomerModule'
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
