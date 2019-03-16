import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Customer } from './customer';
import { CustomerFilterTemplate } from './customer-filter-template';

import { mockCustomers } from './mock-customers';
import { mockCustomerFilterTemplates } from './mock-customer-filter-templates';
import { mockCustomerFilterTemplateQuestions } from './mock-customer-filter-template-questions';
import { QuestionBase } from '../../shared/dynamic-form/question-base';

@Injectable()
export class CustomerInMemoryDataService implements InMemoryDbService {
  createDb() {

    const customers: Customer[] = mockCustomers;

    const customerFilterTemplates: CustomerFilterTemplate[] = mockCustomerFilterTemplates;

    const customerFilterTemplateQuestions: QuestionBase[] = mockCustomerFilterTemplateQuestions;

    return { customers, customerFilterTemplates, customerFilterTemplateQuestions };
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.

  // genId(heroes: Hero[]): number {
  //   return heroes.length > 0
  //     ? Math.max(...heroes.map(hero => hero.id)) + 1
  //     : 11;
  // }
}
