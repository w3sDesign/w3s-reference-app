// currently not used
import { InjectionToken } from '@angular/core';
import { CustomerService } from './http-customer.service';

export const customerConfig = new InjectionToken<any>('customer.config');

export const questionsConfig = this.customerFilterTemplateQuestions;

class CustomerConfig {
  customerFilterTemplateQuestions;
  constructor(customerService: CustomerService) {
 /** Getting the questions for generating w3s-dynamic-form. */
    customerService.getCustomerFilterTemplateQuestions()
      .subscribe(
        res => this.customerFilterTemplateQuestions = res
      );
  }

}
