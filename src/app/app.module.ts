import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

// import { HttpClientModule } from '@angular/shared/http';
// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { environment } from '../environments/environment';

// import { CustomerModule } from './customers/customer.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { SharedMaterialModule } from './shared/shared-material.module';

import { MessageDialogComponent } from './shared/message-dialog/message-dialog.component';
import { MessageSnackBarComponent } from './shared/message-snack-bar/message-snack-bar.component';

import { HttpErrorHandler } from './shared/http-error-handler.service';
import { HttpUtilsService } from './shared/http-utils.service';
import { MessageService } from './shared/message.service';
// import { MatSnackBarModule } from '@angular/material';
// import { MatSnackBarContainer } from '@angular/material';

// import { MatSnackBar, MatSnackBarContainer } from '@angular/material';

// import { DynamicFormComponent } from './shared/dynamic-form/dynamic-form.component';
// import { DynamicFormQuestionComponent } from './shared/dynamic-form/dynamic-form-question.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    SharedMaterialModule,
    // MatSnackBarModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    MessageDialogComponent,
    MessageSnackBarComponent,
    // DynamicFormComponent,
    // DynamicFormQuestionComponent,
  ],
  entryComponents: [
    MessageDialogComponent,
    MessageSnackBarComponent,
    // MatSnackBarContainer
  ],
  providers: [
    HttpErrorHandler,
    HttpUtilsService,
    MessageService,
    // MatSnackBar,
    // MatSnackBarContainer
  ],
  exports: [
    MessageDialogComponent,
    MessageSnackBarComponent,
    // MatSnackBarContainer
    // MessageDialogComponent, SharedMaterialModule,
    // HttpErrorHandler,
    // HttpUtilsService,
    // MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
