import { QuestionBase } from '../../shared/dynamic-form/question-base';

// TODO? mockCustomerDetailQuestions for CustomerDetailComponent
export const mockCustomerQuestions: QuestionBase[] = [
  // Group 1: Basic Data

  {
    key: 'id',
    value: 0,
    label: 'Id',
    controlType: 'textbox',
    inputType: 'number',
    group: 1,
    groupName: 'Basic Data',
    order: 110,
    required: false,
    isDisabled: false,
  },
  {
    key: 'name',
    value: '',
    label: 'Name',
    controlType: 'textbox',
    inputType: 'text',
    group: 1,
    groupName: 'Basic Data',
    order: 120,
    required: false,
    isDisabled: false,
  },

  // Group 2: Main Address and Additional Addresses

  {
    key: 'street',
    value: '',
    label: 'Street',
    controlType: 'textbox',
    inputType: 'text',
    group: 2,
    groupName: 'Addresses',
    order: 210,
    required: false,
    isDisabled: false,
  },
  {
    key: 'postalCode',
    value: '',
    label: 'Postal Code',
    controlType: 'textbox',
    inputType: 'textarea',
    group: 2,
    groupName: 'Addresses',
    order: 230,
    required: false,
    isDisabled: false,
  },
  {
    key: 'city',
    value: '',
    label: 'City',
    controlType: 'textbox',
    inputType: 'textarea',
    group: 2,
    groupName: 'Addresses',
    order: 240,
    required: false,
    isDisabled: false,
  },

  // Additional Addresses
  {
    key: 'addAddresses',
    value: '',
    controlType: 'formArray',
    group: 2,
    nestedQuestions: [
      {
        key: 'addStreet',
        value: '',
        label: 'Street',
        controlType: 'textbox',
        inputType: 'text',
        group: 2,
        order: 250,
        required: false,
        isDisabled: false,
      },
      {
        key: 'addPostalCode',
        value: '',
        label: 'Postal Code',
        controlType: 'textbox',
        inputType: 'textarea',
        group: 2,
        order: 260,
        required: false,
        isDisabled: false,
      },
      {
        key: 'addCity',
        value: '',
        label: 'City',
        controlType: 'textbox',
        inputType: 'textarea',
        group: 2,
        order: 270,
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
