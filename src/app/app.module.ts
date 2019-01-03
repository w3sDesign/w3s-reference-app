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

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,

    // HttpClientModule,

    //////////////////////////////////////////////////////////////////////
    //  The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    //  and returns simulated server responses.
    //  Remove it when a real server is ready to receive requests.
    // environment.production
    //   ? []
    //   : HttpClientInMemoryWebApiModule.forRoot(CustomerInMemoryDataService, {
    //     delay: 350,
    //     dataEncapsulation: false
    //   }),
    // https://github.com/angular/in-memory-web-api/blob/master/CHANGELOG.md#050-2017-10-05
    //////////////////////////////////////////////////////////////////////

    SharedMaterialModule,
    // CustomerModule, = lazy loaded
    AppRoutingModule,
  ],
  entryComponents: [
    MessageDialogComponent
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    MessageDialogComponent
  ],
  exports: [
    MessageDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
