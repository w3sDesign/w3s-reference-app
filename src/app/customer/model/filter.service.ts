import { Injectable } from '@angular/core';

import { QuestionBase } from '../../shared/dynamic-form/question-base';


@Injectable()
export class FilterService { 

  getFilters() {

    const filters: QuestionBase[] = [

      {
        key: 'id', // customer id
        value: 'value2',
        label: 'Filter by Id',
        controlType: 'textbox',
        inputType: 'text',
        order: 10,
      },
      {
        key: 'name', // customer name
        value: 'value3',
        label: 'Filter by Name',
        controlType: 'textbox',
        inputType: 'text',
        order: 20,
      },
      {
        key: 'city',
        value: 'value4',
        label: 'Filter by City',
        controlType: 'textbox',
        inputType: 'textarea',
        order: 30,
      },
      {
        key: 'cityCheckbox',
        value: '',
        label: 'Filter by City',
        controlType: 'checkbox',
        order: 31,
      },
      {
        key: 'email',
        value: 'default',
        label: 'Filter by Email',
        controlType: 'textbox',
        inputType: 'text',
        order: 40,
      },
      {
        key: 'status',
        label: 'Filter by Status',
        controlType: 'dropdown',
        options: [
          { key: 'solid', value: 'Solid' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
          { key: 'unproven', value: 'Unproven' }
        ],
        order: 50


      }];

    return filters.sort((a, b) => a.order - b.order);

  }




  getSelectFilters() {

    const filters: QuestionBase[] = [
      {
        key: 'name',
        value: '',
        label: 'Filter by Name',
        controlType: 'checkbox',
        order: 1,
      },
      {
        key: 'city',
        value: '',
        label: 'Filter by City',
        controlType: 'checkbox',
        order: 1,
      },
      {
        key: 'email',
        value: '',
        label: 'Filter by Email',
        controlType: 'checkbox',
        order: 1,
      },
    ];

    return filters.sort((a, b) => a.order - b.order);

  }



}
