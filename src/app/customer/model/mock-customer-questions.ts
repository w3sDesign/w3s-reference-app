import { QuestionBase } from '../../shared/dynamic-form/question-base';

// TODO? mockCustomerDetailQuestions for CustomerDetailComponent
export const mockCustomerQuestions: QuestionBase[] = [
  // Group 1: Basic Data

  {
    name: 'id',
    defaultValue: 0,
    label: 'Id',
    tooltip: 'Auto-generated unique number',
    controlType: 'textbox',
    inputType: 'number',
    group: 1,
    groupName: 'Basic Data',
    order: 110,
    isRequired: true,
    // isDisabled: false,
    isReadonly: true,
  },
  {
    name: 'name',
    defaultValue: '',
    label: 'Name',
    tooltip: 'Full company name',
    controlType: 'textbox',
    inputType: 'text',
    group: 1,
    groupName: 'Basic Data',
    order: 120,
    isRequired: true,
    // isDisabled: false,
  },

  // Group 2: Main Address and Additional Addresses

  {
    name: 'street',
    defaultValue: '',
    label: 'Street',
    controlType: 'textbox',
    inputType: 'text',
    group: 2,
    groupName: 'Addresses',
    order: 210,
    // isRequired: false,
    // isDisabled: false,
  },
  {
    name: 'postalCode',
    defaultValue: '',
    label: 'Postal Code',
    controlType: 'textbox',
    inputType: 'textarea',
    group: 2,
    groupName: 'Addresses',
    order: 230,
    isRequired: false,
    isDisabled: false,
  },
  {
    name: 'city',
    defaultValue: '',
    label: 'City',
    controlType: 'textbox',
    inputType: 'textarea',
    group: 2,
    groupName: 'Addresses',
    order: 240,
    isRequired: false,
    isDisabled: false,
  },

  // Additional Addresses
  {
    name: 'addAddresses',
    defaultValue: '',
    controlType: 'formArray',
    group: 3,
    groupName: 'Additional Addresses',
    nestedQuestions: [
      {
        name: 'street',
        defaultValue: '',
        label: 'Street',
        controlType: 'textbox',
        inputType: 'text',
        // group: 2,
        order: 250,
        // isRequired: false,
        // isDisabled: false,
      },
      {
        name: 'postalCode',
        defaultValue: '',
        label: 'Postal Code',
        controlType: 'textbox',
        inputType: 'text',
        // group: 2,
        order: 260,
        // isRequired: false,
        // isDisabled: false,
      },
      {
        name: 'city',
        defaultValue: '',
        label: 'City',
        controlType: 'textbox',
        inputType: 'text',
        // group: 2,
        order: 270,
        // isRequired: false,
        // isDisabled: false,
      },
    ]
  },

];

  // {
  //   name: 'customerStatus',
  //   defaultValue: '',
  //   label: 'Filter by Status',
  //   controlType: 'dropdown',
  //   inputType: '',
  //   order: 50,
  //   isRequired: false,

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
