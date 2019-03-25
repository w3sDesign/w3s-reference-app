import { QuestionBase } from '../../shared/dynamic-form/question-base';


export const mockCustomerQuestions: QuestionBase[] = [
  {
    key: 'id',
    value: 0,
    label: 'Id',
    controlType: 'textbox',
    inputType: 'number',
    order: 1,
    required: false,
    isDisabled: false,
  },
  {
    key: 'name',
    value: '',
    label: 'Name',
    controlType: 'textbox',
    inputType: 'text',
    order: 2,
    required: false,
    isDisabled: false,
  },

  // Main Address
  {
    key: 'street',
    value: '',
    label: 'Street',
    controlType: 'textbox',
    inputType: 'text',
    order: 10,
    required: false,
    isDisabled: false,
  },
  {
    key: 'postalCode',
    value: '',
    label: 'Postal Code',
    controlType: 'textbox',
    inputType: 'textarea',
    order: 30,
    required: false,
    isDisabled: false,
  },
  {
    key: 'city',
    value: '',
    label: 'City',
    controlType: 'textbox',
    inputType: 'textarea',
    order: 30,
    required: false,
    isDisabled: false,
  },
  {
    key: 'addresses',
    value: '',
    controlType: 'formArray',
    nestedQuestions: [
      {
        key: 'street2',
        value: '',
        label: 'Street 2',
        controlType: 'textbox',
        inputType: 'text',
        order: 10,
        required: false,
        isDisabled: false,
      },
      {
        key: 'postalCode2',
        value: '',
        label: 'Postal Code 2',
        controlType: 'textbox',
        inputType: 'textarea',
        order: 30,
        required: false,
        isDisabled: false,
      },
    ]
  },

];

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




// TODO !?

// export class CustomerFilterTemplateQuestions {

//   getQuestions(): QuestionBase[] {

//     const questions: QuestionBase[] = [
//      .....
//     ];

//     return questions.sort((a, b) => a.order - b.order);
//   }
// }
