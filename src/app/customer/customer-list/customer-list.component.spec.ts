import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  ActivatedRoute, ActivatedRouteStub, asyncData, click, newEvent
} from '../../../testing';

import { Customer } from '../model/customer';
import { CustomerModule } from '../customer.module';
import { CustomerListComponent } from './customer-list.component';
import { CustomerRoutingModule } from '../customer-routing.module';

import { CustomerService, HttpCustomerService } from '../model/http-customer.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';

import { mockCustomers } from '../model/mock-customers';

// ?  import { TestCustomerService } from '../model/testing/test-customer.service';

const heroes = mockCustomers;

/** Testing Vars */
let component: CustomerListComponent;
let fixture: ComponentFixture<CustomerListComponent>;
let activatedRoute: ActivatedRouteStub;
// let page: Page;


describe('CustomerListComponent', () => {

  beforeEach(async(() => {
    const routerSpy = createRouterSpy();
    TestBed.configureTestingModule({
      imports: [
        CustomerModule,
        CustomerRoutingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: routerSpy },

        { provide: CustomerService, useClass: HttpCustomerService },
        // { provide: HttpErrorHandler, useValue: {} }
        { provide: HttpErrorHandler, useClass: HttpErrorHandler }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerListComponent);
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


