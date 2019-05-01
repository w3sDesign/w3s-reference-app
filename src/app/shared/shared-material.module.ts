/**
 * Shared NgModule that exports all Angular Material
 * components that will be used in the application.
 * Include this module wherever the components are used.
 */

import { NgModule } from '@angular/core';

import {
  MatAutocompleteModule,
  MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatButtonToggleModule,
  MatCardModule, MatCheckboxModule, // MatChipsModule,
  MatDatepickerModule, MatDialogModule, MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule, MatInputModule,
  MatListModule,
  MatMenuModule,
  // MatNativeDateModule,
  MatPaginatorModule, MatProgressSpinnerModule, // MatProgressBarModule,
  MatRadioModule, MatRippleModule,
  MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatStepperModule,
  MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, // MatTreeModule
} from '@angular/material';

import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  imports: [],
  exports: [
    MatAutocompleteModule,
    MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatButtonToggleModule,
    MatCardModule, MatCheckboxModule, // MatChipsModule,
    MatDatepickerModule, MatDialogModule, MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule, MatInputModule,
    MatListModule,
    MatMenuModule,
    // MatNativeDateModule,
    MatPaginatorModule, MatProgressSpinnerModule, // MatProgressBarModule,
    MatRadioModule, MatRippleModule,
    MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatStepperModule,
    MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, // MatTreeModule

    DragDropModule,
  ],
})

export class SharedMaterialModule { }
