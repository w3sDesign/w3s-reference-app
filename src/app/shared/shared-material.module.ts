/**
 * Create a shared NgModule that imports all of the Angular
 * Material components that will be used in the application.
 * Include this module wherever you'd like to use the components.
 *
 * Be sure to import the Angular Material modules after Angular's
 * BrowserModule, as the import order matters for NgModules.
 */

import { NgModule } from '@angular/core';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  // MatChipsModule, MatDatepickerModule,
  MatDialogModule, MatDividerModule, MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule, MatListModule, MatMenuModule,
  // MatNativeDateModule,
  MatPaginatorModule,
  // MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule,
  MatSortModule, MatStepperModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule,
  // MatTreeModule
} from '@angular/material';

@NgModule({
  imports: [
    // BrowserAnimationsModule,

    MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    // MatChipsModule, MatDatepickerModule,
    MatDialogModule, MatDividerModule, MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule, MatListModule, MatMenuModule,
    // MatNativeDateModule,
    MatPaginatorModule,
    // MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule,
    MatSortModule, MatStepperModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule,
    // MatTreeModule
  ],
  exports: [
    // BrowserAnimationsModule,

    MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    // MatChipsModule, MatDatepickerModule,
    MatDialogModule, MatDividerModule, MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule, MatListModule, MatMenuModule,
    // MatNativeDateModule,
    MatPaginatorModule,
    // MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule,
    MatSortModule, MatStepperModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule,
    // MatTreeModule
  ],
})
export class SharedMaterialModule { }
