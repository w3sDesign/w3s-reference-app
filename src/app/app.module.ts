import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Moved to SharedModule!
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LayoutModule } from '@angular/cdk/layout';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

////////////
// No import (load) of feature modules! They are loaded lazily.

// import { CustomerModule } from './customer/customer.module';
// import { CustomerRoutingModule } from './customer/customer-routing.module';

// import { ProductModule } from './product/product.module';
// import { ProductRoutingModule } from './product/product-routing.module';
//////////

// Moved to SharedModule!
import { MessageDialogComponent } from './shared/message-dialog/message-dialog.component';
import { MessageSnackBarComponent } from './shared/message-snack-bar/message-snack-bar.component';
import { InputDialogComponent } from './shared/input-dialog/input-dialog.component';

// Moved to SharedModule!
import { HttpErrorHandler } from './shared/http-error-handler.service';
import { UtilsService } from './shared/utils.service';
import { MessageService } from './shared/message.service';

import { SharedModule } from './shared/shared.module';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';


@NgModule({
  // Module import order matters!
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // FormsModule,
    // ReactiveFormsModule,
    // LayoutModule,
    SharedModule,
    // CustomerModule,
    // ProductModule,
    // MatSnackBarModule,
    // Each routing module augments the route configuration in the order of import.
    // CustomerRoutingModule,
    // ProductRoutingModule,
    AppRoutingModule, // must be the last
  ],

  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    // MessageDialogComponent,
    // MessageSnackBarComponent,
    // InputDialogComponent,
  ],

  entryComponents: [
    // MessageDialogComponent,
    // MessageSnackBarComponent,
    // InputDialogComponent,
  ],

  providers: [
    // HttpErrorHandler,
    // HttpUtilsService,
    // MessageService,
  ],

  exports: [
    // MessageDialogComponent,
    // MessageSnackBarComponent,
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
