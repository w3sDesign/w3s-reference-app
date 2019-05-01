import { Injectable } from '@angular/core';

import { QuestionBase } from '../../shared/dynamic-form/question-base';

@Injectable()
export class FilterTemplateQuestionService {

  getQuestions() {

    const questions: QuestionBase[] = [
      {
        name: 'templateId',
        defaultValue: ' ',
        label: 'Template Id',
        controlType: 'textbox',
        inputType: 'text',
        order: 2,
      },
      {
        name: 'templateName',
        defaultValue: '',
        label: 'Template Name',
        controlType: 'textbox',
        inputType: 'text',
        order: 3,
      },


      {
        name: 'id', // customer id
        defaultValue: 'value2',
        label: 'Filter by Id',
        controlType: 'textbox',
        inputType: 'text',
        order: 4,
      },
      {
        name: 'name', // customer name
        defaultValue: 'value3',
        label: 'Filter by Name',
        controlType: 'textbox',
        inputType: 'text',
        order: 5,
      },
      {
        name: 'city',
        defaultValue: 'value4',
        label: 'Filter by City',
        controlType: 'textbox',
        inputType: 'textarea',
        order: 6,
      },
      {
        name: 'email',
        defaultValue: 'default',
        label: 'Filter by Email',
        controlType: 'textbox',
        inputType: 'text',
        order: 10,
      },
      {
        name: 'status',
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


