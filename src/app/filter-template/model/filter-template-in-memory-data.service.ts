import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InMemoryDbService } from 'angular-in-memory-web-api';

import { FilterTemplate } from './filter-template';
import { mockFilterTemplates } from './mock-filter-templates';

@Injectable()
export class FilterTemplateInMemoryDataService implements InMemoryDbService {
  createDb() {

    const filterTemplates: FilterTemplate[] = mockFilterTemplates;



    return { filterTemplates };
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
