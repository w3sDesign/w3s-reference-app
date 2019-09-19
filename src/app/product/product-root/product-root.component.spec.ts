import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  ActivatedRoute, ActivatedRouteStub, asyncData, click, newEvent
} from '../../../testing';

import { Product } from '../model/product';
import { ProductRootComponent } from './product-root.component';
import { ProductModule } from '../product.module';
import { ProductRoutingModule } from '../product-routing.module';

/** RouterOutletStubComponent */
@Component({selector: 'router-outlet', template: ''})
class RouterOutletStubComponent {}

/** Testing Vars */
let component: ProductRootComponent;
let fixture: ComponentFixture<ProductRootComponent>;
let activatedRoute: ActivatedRouteStub;
// let page: Page;


describe('ProductRootComponent', () => {

  beforeEach(async(() => {
    const routerSpy = createRouterSpy();
    TestBed.configureTestingModule({
      imports: [
        ProductModule,
        ProductRoutingModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [
        RouterOutletStubComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: routerSpy },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});


/** Helpers */
function createRouterSpy() {
  return jasmine.createSpyObj('Router', ['navigate']);
}


