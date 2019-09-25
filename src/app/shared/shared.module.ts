import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { HighlightDirective } from './directives/highlight.directive';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form/dynamic-form-question.component';
import { DynamicFormGroupService } from './dynamic-form/dynamic-form-group.service';

// Moved from AppModule!
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { MessageSnackBarComponent } from './message-snack-bar/message-snack-bar.component';
import { InputDialogComponent } from './input-dialog/input-dialog.component';

import { HttpErrorHandler } from './http-error-handler.service';
import { UtilsService } from './utils.service';
import { MessageService } from './message.service';

import { SharedMaterialModule } from './shared-material.module';


// https://angular.io/guide/i18n#i18n-pipes
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

import { MomentDatePipe } from './pipes/momentDate.pipe';
import { FirstLetterCasePipe } from './pipes/first-letter-case.pipe';

registerLocaleData(localeDe, 'de');



@NgModule({

  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, LayoutModule,
    SharedMaterialModule
  ],

  declarations: [
    DynamicFormComponent, DynamicFormQuestionComponent,
    HighlightDirective,
    MomentDatePipe, FirstLetterCasePipe,

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
    DynamicFormGroupService,

    HttpErrorHandler,
    UtilsService,
    MessageService,
  ],

  // Shared modules (must) export everything.
  exports: [
    CommonModule, FormsModule, ReactiveFormsModule, LayoutModule,
    SharedMaterialModule,

    DynamicFormComponent, DynamicFormQuestionComponent,
    HighlightDirective,
    MomentDatePipe, FirstLetterCasePipe,

    MessageDialogComponent,
    MessageSnackBarComponent,
    InputDialogComponent,
  ],

})

export class SharedModule { }

