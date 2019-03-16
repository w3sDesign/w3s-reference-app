import { CustomerFilterTemplate } from './customer-filter-template';

export const mockCustomerFilterTemplates: CustomerFilterTemplate[] = [
  {
    id: 0,
    name: 'standard',

    customerId: '>20010',
    customerName: 'Foundation',

    // Addresses

    // TODO if country === 'disabled' set form control = disabled
    // country: 'disabled',
    customerPostalCode: '',
    customerCity: '',
    // street: 'disabled',

    // Contacts

    // customerDepartment: '',
    // customerPerson: '',
    // customerPhone: '',
    // customerEmail: '',

    // customerStatus: ''
  },

  {
    id: 1,
    name: 'myTemplate',

    customerId: '',
    customerName: 'w3sdesign',

    // country: 'disabled',
    customerPostalCode: '',
    customerCity: 'vienna',
    // street: 'disabled',

    // Contacts

    // customerDepartment: '',
    // customerPerson: '',
    // customerPhone: '',
    // customerEmail: '',
    // customerStatus: ''
  },

];
