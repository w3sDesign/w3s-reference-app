import { NgModule } from '@angular/core';

// CommonModule instead of BrowserModule
// (BrowserModule only in the root AppModule).
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FilterTemplateInMemoryDataService } from './model/filter-template-in-memory-data.service';
import { environment } from '../../environments/environment';

import { FilterTemplateRootComponent } from './filter-template-root/filter-template-root.component';
import { FilterTemplateListComponent } from './filter-template-list/filter-template-list.component';
import { FilterTemplateDetailComponent,
  FilterTemplateDetailDialogComponent } from './filter-template-detail/filter-template-detail.component';
import { HttpFilterTemplateService } from './model/http-filter-template.service';
import { FilterTemplateQuestionService } from './model/filter-template-question.service';
import { FilterTemplateService } from './model/mock-filter-template.service';

import { FilterTemplateRoutingModule } from './filter-template-routing.module';

import { SharedMaterialModule } from '../shared/shared-material.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,

    HttpClientModule,
    //  The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    //  and returns simulated server responses.
    //  Remove it when a real server is ready to receive requests.
    environment.production
      ? []
      : HttpClientInMemoryWebApiModule
        .forFeature(FilterTemplateInMemoryDataService, {
          delay: 350,
          dataEncapsulation: false
        }),

    FilterTemplateRoutingModule,
    SharedMaterialModule,
    SharedModule,
  ],

  declarations: [
    FilterTemplateRootComponent,
    FilterTemplateListComponent,
    FilterTemplateDetailComponent,
    FilterTemplateDetailDialogComponent,
  ],

  entryComponents: [
    FilterTemplateDetailDialogComponent,
  ],

  providers: [
    HttpFilterTemplateService,
    // {provide: FilterTemplateService, useClass: HttpFilterTemplateService},
    FilterTemplateInMemoryDataService,
    FilterTemplateQuestionService,
    FilterTemplateService,
  ],

  exports: [
    // FilterTemplateRootComponent,
    // FilterTemplateListComponent,
    // FilterTemplateDetailComponent,
    // FilterTemplateDetailDialogComponent,
  ]
})

export class FilterTemplateModule { }
