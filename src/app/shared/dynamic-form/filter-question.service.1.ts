import { Injectable } from '@angular/core';

import { QuestionBase } from './question-base';


@Injectable()
export class FilterService {

  getFilterQuestions() {

    const questions: QuestionBase[] = [

      {
        key: 'id', // customer id
        value: 'value2',
        label: 'Filter by Id',
        controlType: 'textbox',
        inputType: 'text',
        order: 2,
      },
      {
        key: 'name', // customer name
        value: 'value3',
        label: 'Filter by Name',
        controlType: 'textbox',
        inputType: 'text',
        order: 3,
      },
      {
        key: 'city',
        value: 'value4',
        label: 'Filter by City',
        controlType: 'textbox',
        inputType: 'textarea',
        order: 4,
      },
      {
        key: 'email',
        value: 'default',
        label: 'Filter by Email',
        controlType: 'textbox',
        inputType: 'text',
        order: 10,
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
        order: 11


      }];

    return questions.sort((a, b) => a.order - b.order);

  }




  getSelectFilterQuestions() {

    const questions: QuestionBase[] = [
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

    return questions.sort((a, b) => a.order - b.order);

  }



}
