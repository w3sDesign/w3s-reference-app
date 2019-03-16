import { Injectable } from '@angular/core';

import { QuestionBase } from '../../shared/dynamic-form/question-base';

@Injectable()
export class FilterTemplateQuestionService {

  getQuestions() {

    const questions: QuestionBase[] = [
      {
        key: 'templateId',
        value: ' ',
        label: 'Template Id',
        controlType: 'textbox',
        inputType: 'text',
        order: 2,
      },
      {
        key: 'templateName',
        value: '',
        label: 'Template Name',
        controlType: 'textbox',
        inputType: 'text',
        order: 3,
      },


      {
        key: 'id', // customer id
        value: 'value2',
        label: 'Filter by Id',
        controlType: 'textbox',
        inputType: 'text',
        order: 4,
      },
      {
        key: 'name', // customer name
        value: 'value3',
        label: 'Filter by Name',
        controlType: 'textbox',
        inputType: 'text',
        order: 5,
      },
      {
        key: 'city',
        value: 'value4',
        label: 'Filter by City',
        controlType: 'textbox',
        inputType: 'textarea',
        order: 6,
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
      }

    ];

    return questions.sort((a, b) => a.order - b.order);

  }

}


