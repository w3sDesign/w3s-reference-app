import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import {
  ActivatedRoute, ActivatedRouteStub, asyncData, click, newEvent
} from '../../../testing';

import { Product } from '../model/product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductModule } from '../product.module';
import { ProductRoutingModule } from '../product-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ProductService, HttpProductService } from '../model/http-product.service';
import { HttpErrorHandler } from 'src/app/shared/http-error-handler.service';


/** Testing Vars */
let component: ProductDetailComponent;
let fixture: ComponentFixture<ProductDetailComponent>;
let activatedRoute: ActivatedRouteStub;
// let page: Page;


describe('ProductDetailComponent', () => {

  beforeEach(async(() => {
    const routerSpy = createRouterSpy();
    TestBed.configureTestingModule({
      imports: [
        ProductModule,
        ProductRoutingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: routerSpy },

        { provide: ProductService, useClass: HttpProductService },
        { provide: HttpErrorHandler, useClass: HttpErrorHandler }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // ? expect(component).toBeDefined();
    // ? expect(component).not.toBeNull();
  });

});


/** Helpers */
function createRouterSpy() {
  return jasmine.createSpyObj('Router', ['navigate']);
}

