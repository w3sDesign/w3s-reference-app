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
    order: 100,
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
    order: 110,
    isRequired: true,
    // isDisabled: false,
  },


  // TODO type + status dropdown ?readOnly
  {
    name: 'type',
    defaultValue: '',
    label: 'Customer Type',
    controlType: 'dropdown',
    inputType: '',
    group: 1,
    groupName: 'Basic Data',
    order: 120,

    options: [
      { key: 'business', value: 'Business' },
      { key: 'individual', value: 'Individual' },
      { key: 'other', value: 'Other' },
    ],
  },

  {
    name: 'status',
    defaultValue: '',
    label: 'Customer Status',
    controlType: 'dropdown',
    inputType: '',
    group: 1,
    groupName: 'Basic Data',
    order: 130,

    options: [
      { key: 'active', value: 'Active' },
      { key: 'suspended', value: 'Suspended' },
      { key: 'pending', value: 'Pending' },
      // { key: 'unproven', value: 'Unproven' }
    ],
  },


  {
    name: 'comment',
    defaultValue: '',
    label: 'Comment',
    controlType: 'textbox',
    inputType: 'text',
    group: 1,
    groupName: 'Basic Data',
    order: 150,
  },



  {
    name: 'creationDate',
    defaultValue: '',
    label: 'Creation Date',
    controlType: 'textbox',
    inputType: 'text',
    group: 1,
    groupName: 'Basic Data',
    order: 160,
  },




  // Group 2: Main Address and Additional Addresses

  {
    name: 'country',
    defaultValue: '',
    label: 'Country',
    controlType: 'textbox',
    inputType: 'text',
    group: 2,
    groupName: 'Addresses',
    order: 200,
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


  // Additional Addresses

  {
    name: 'addAddresses',
    defaultValue: '',
    controlType: 'formArray',
    group: 3,
    groupName: 'Additional Addresses',
    nestedQuestions: [
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
    ]
  },


  // Group 4: Main Contact and additional Contacts

  {
    name: 'department',
    defaultValue: '',
    label: 'Contact Department',
    controlType: 'textbox',
    inputType: 'text',
    group: 4,
    groupName: 'Contacts',
    order: 400,
  },

  {
    name: 'person',
    defaultValue: '',
    label: 'Contact Person',
    controlType: 'textbox',
    inputType: 'text',
    group: 4,
    groupName: 'Contacts',
    order: 410,
  },

  {
    name: 'phone',
    defaultValue: '',
    label: 'Phone',
    controlType: 'textbox',
    inputType: 'text',
    group: 4,
    groupName: 'Contacts',
    order: 420,
  },

  {
    name: 'email',
    defaultValue: '',
    label: 'Email',
    controlType: 'textbox',
    inputType: 'text',
    group: 4,
    groupName: 'Contacts',
    order: 430,
  },


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
