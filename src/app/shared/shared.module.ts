import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { HighlightDirective } from './directives/highlight.directive';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form/dynamic-form-question.component';
import { DynamicFormGroupService } from './dynamic-form/dynamic-form-group.service';

import { SharedMaterialModule } from './shared-material.module';



@NgModule({

  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, LayoutModule,
    SharedMaterialModule
  ],

  declarations: [
    HighlightDirective,
    DynamicFormComponent, DynamicFormQuestionComponent,
  ],

  providers: [
    DynamicFormGroupService
  ],

  exports: [
    HighlightDirective,
    DynamicFormComponent, DynamicFormQuestionComponent,

    CommonModule, FormsModule, ReactiveFormsModule, LayoutModule,
    SharedMaterialModule
  ],

})

export class SharedModule { }

