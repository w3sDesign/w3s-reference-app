/**
 * Shared NgModule that exports all Angular Material
 * components that will be used in the application.
 * Include this module wherever the components are used.
 */

import { NgModule } from '@angular/core';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio'; // // MatProgressBarModule,
import { MatRippleModule } from '@angular/material/core'; // MatNativeDateModule,
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DateAdapter, MatDateFormats, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

// Using moment date library (https://momentjs.com/)
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';


// Customizing mat datepicker moment date format.
// https://material.angular.io/components/datepicker/overview#customizing-the-parse-and-display-formats

// MAT_DATE_FORMAT uses dateInput: 'l' (like 1.7.2019).
// https://github.com/angular/components/blob/master/src/material-moment-adapter/adapter/moment-date-formats.ts

// W3S_MAT_MOMENT_DATE_FORMAT uses dateInput: 'L' (like 01.07.2019)
// https://momentjs.com/docs/#/displaying/format/

export const W3S_MAT_MOMENT_DATE_FORMAT: MatDateFormats = {
  parse: {
    dateInput: 'L', // instead of 'l'
  },
  display: {
    dateInput: 'L', // instead of 'l'
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};



@NgModule({
  imports: [],

  declarations: [],

  providers: [

    { provide: MAT_DATE_LOCALE, useValue: 'de' },

    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    // Using MAT_MOMENT_DATE_FORMATS (1.7.2019)
    // { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },

    // Using W3S_MAT_MOMENT_DATE_FORMAT (01.07.2019)
    { provide: MAT_DATE_FORMATS, useValue: W3S_MAT_MOMENT_DATE_FORMAT },

  ],

  exports: [
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatButtonToggleModule,
    MatCardModule, MatCheckboxModule, // MatChipsModule,
    MatDatepickerModule, MatDialogModule, MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule, MatInputModule,
    MatListModule,
    MatMenuModule,

    MatMomentDateModule,

    // MatNativeDateModule,
    MatPaginatorModule, MatProgressSpinnerModule,
    // MatProgressBarModule,
    MatRadioModule, MatRippleModule,
    MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule,
    MatSnackBarModule, MatSortModule, MatStepperModule,
    MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule,
    // MatTreeModule
  ],
})

export class SharedMaterialModule { }
