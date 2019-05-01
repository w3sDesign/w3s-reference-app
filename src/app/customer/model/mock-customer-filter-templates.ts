import { CustomerFilterTemplate } from './customer-filter-template';

export const mockCustomerFilterTemplates: CustomerFilterTemplate[] = [
  {
    id: 0,
    name: 'standard',

    idFilter: '>20010',
    nameFilter: 'Foundation',

    // Addresses

    // TODO if country === 'disabled' set form control = disabled
    // country: 'disabled',
    postalCodeFilter: '',
    cityFilter: '',
    // streetFilter: 'disabled',

    // Contacts

    // Department: '',
    // Person: '',
    // Phone: '',
    // Email: '',

    // Status: ''
  },

  {
    id: 1,
    name: 'myTemplate',

    idFilter: '',
    nameFilter: 'w3sdesign',

    // country: 'disabled',
    postalCodeFilter: '',
    cityFilter: 'vienna',
    // street: 'disabled',

    // Contacts

    // Department: '',
    // Person: '',
    // Phone: '',
    // Email: '',
    // Status: ''
  },

];
