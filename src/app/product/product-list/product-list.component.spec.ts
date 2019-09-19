import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Router } from '@angular/router';

import {
  ActivatedRoute, ActivatedRouteStub, asyncData, click, newEvent
} from '../../../testing';

import { ProductModule } from '../product.module';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../model/product.service';

import { mockProducts } from '../model/mock-products';
import { MockProductService } from '../model/mock-product.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



/** Testing Vars */
const products = mockProducts;
let component: ProductListComponent;
let fixture: ComponentFixture<ProductListComponent>;
let page: Page;



describe('ProductListComponent', () => {

  beforeEach(async(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ProductModule, BrowserAnimationsModule],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: Router, useValue: routerSpy },
      ]
    })
      .compileComponents()
      .then(createComponent);
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('1st product should match 1st mock product', () => {
    const expectedProduct = products[0];
    const actualProduct = page.productRows[0].textContent;
    expect(actualProduct).toContain(expectedProduct.id.toString(), 'product.id');
    expect(actualProduct).toContain(expectedProduct.name, 'product.name');
  });

  it('should select product on click', fakeAsync(() => {
    const expectedProduct = products[1];
    const row = page.productRows[1];
    row.dispatchEvent(newEvent('click'));
    tick();
    expect(component.selectedProduct).toEqual(expectedProduct);
  }));

  it('should navigate to the select product detail on click', fakeAsync(() => {
    const expectedProduct = products[1];
    const row = page.productRows[1];
    row.dispatchEvent(newEvent('click'));
    tick();

    // The navigation spy has been called at least once.
    expect(page.navSpy.calls.any()).toBe(true, 'navigate spy called');

    const navArgs = page.navSpy.calls.first().args[0];
    expect(navArgs[0])

  }));


});



/**
 * ####################################################################
 * Helpers
 * ####################################################################
 */

function createComponent() {
  fixture = TestBed.createComponent(ProductListComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page();
  });
}

class Page {

  productRows: HTMLTableRowElement[];

  navSpy: jasmine.Spy;

  constructor() {

    const rowNodes = fixture.nativeElement.querySelector('tbody')
      .querySelectorAll('tr');
    this.productRows = Array.from(rowNodes);

    const routerSpy = fixture.debugElement.injector.get(Router);
    this.navSpy = routerSpy.navigate as jasmine.Spy;
  }

}

