/**
 * ProductRootComponent is the root of the product feature area,
 * just as AppComponent is the root of the entire app.
 *
 * It is a shell for the product management feature area,
 * just as the AppComponent is a shell to manage the high-level workflow
 *
 * (https://angular.io/guide/router#a-crisis-center-with-child-routes).
 *
 */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-root',
  templateUrl: './product-root.component.html',
  styleUrls: ['./product-root.component.scss']
})
export class ProductRootComponent { }
