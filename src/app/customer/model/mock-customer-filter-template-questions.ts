import { CustomerFilterTemplate } from './customer-filter-template';
import { QuestionBase } from '../../shared/dynamic-form/question-base';


export const mockCustomerFilterTemplateQuestions: QuestionBase[] = [
  {
    key: 'id',
    value: 0,
    label: 'Template Id',
    controlType: 'textbox',
    inputType: 'number',
    order: 1,
    required: false,
    isDisabled: true,
  },
  {
    key: 'name',
    value: 'standard',
    label: 'Template Name',
    controlType: 'textbox',
    inputType: 'text',
    order: 2,
    required: false,
    isDisabled: true,
  },

  {
    key: 'customerId',
    value: '', // this.test.value,
    label: 'Filter by Customer Id',
    controlType: 'textbox',
    inputType: 'text',
    order: 10,
    required: false,
    isDisabled: false,
  },
  {
    key: 'customerName',
    value: '',
    label: 'Filter by Customer Name',
    controlType: 'textbox',
    inputType: 'text',
    order: 20,
    required: false,
    isDisabled: false,
  },

// Addresses
{
  key: 'customerPostalCode',
  value: '',
  label: 'Filter by Postal Code',
  controlType: 'textbox',
  inputType: 'textarea',
  order: 30,
  required: false,
  isDisabled: false,
},
{
  key: 'customerCity',
  value: '',
  label: 'Filter by City',
  controlType: 'textbox',
  inputType: 'textarea',
  order: 30,
  required: false,
  isDisabled: false,
},

  // {
  //   key: 'customerEmail',
  //   value: '',
  //   label: 'Filter by Email',
  //   controlType: 'textbox',
  //   inputType: 'text',
  //   order: 40,
  //   required: false,
  // },
  // {
  //   key: 'customerStatus',
  //   value: '',
  //   label: 'Filter by Status',
  //   controlType: 'dropdown',
  //   inputType: '',
  //   order: 50,
  //   required: false,

  //   options: [
  //     { key: 'solid', value: 'Solid' },
  //     { key: 'great', value: 'Great' },
  //     { key: 'good', value: 'Good' },
  //     { key: 'unproven', value: 'Unproven' }
  //   ],
  // }

];



// TODO !?

// export class CustomerFilterTemplateQuestions {

//   getQuestions(): QuestionBase[] {

//     const questions: QuestionBase[] = [
//      .....
//     ];

//     return questions.sort((a, b) => a.order - b.order);
//   }
// }
