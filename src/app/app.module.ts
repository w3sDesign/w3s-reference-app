import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

// import { HttpClientModule } from '@angular/shared/http';
// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { environment } from '../environments/environment';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { CustomerModule } from './customer/customer.module';
import { CustomerRoutingModule } from './customer/customer-routing.module';

import { MessageDialogComponent } from './shared/message-dialog/message-dialog.component';
import { MessageSnackBarComponent } from './shared/message-snack-bar/message-snack-bar.component';
import { InputDialogComponent } from './shared/input-dialog/input-dialog.component';

import { HttpErrorHandler } from './shared/http-error-handler.service';
import { HttpUtilsService } from './shared/http-utils.service';
import { MessageService } from './shared/message.service';

import { SharedMaterialModule } from './shared/shared-material.module';



@NgModule({
  // Module import order matters!
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    SharedMaterialModule,
    CustomerModule,
    // MatSnackBarModule,
    // Each routing module augments the route configuration in the order of import.
    CustomerRoutingModule,
    AppRoutingModule, // must be the last
  ],

  declarations: [
    AppComponent,
    HomeComponent,
    MessageDialogComponent,
    MessageSnackBarComponent,
    InputDialogComponent,
  ],

  entryComponents: [
    MessageDialogComponent,
    MessageSnackBarComponent,
    InputDialogComponent,
  ],

  providers: [
    HttpErrorHandler,
    HttpUtilsService,
    MessageService,
  ],

  exports: [
    MessageDialogComponent,
    MessageSnackBarComponent,
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
