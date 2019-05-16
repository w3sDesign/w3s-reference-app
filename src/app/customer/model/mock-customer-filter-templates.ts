import { CustomerFilterTemplate } from './customer-filter-template';

export const mockCustomerFilterTemplates: any[] = [
  {
    id: 0,
    name: '',

    idFilter: '',
    nameFilter: '',
  },
  {
    id: 1,
    name: 'standard',

    idFilter: '>20010',
    nameFilter: 'Foundation',

    // country: '',
    // postalCodeFilter: '',
    // cityFilter: '',
    // streetFilter: '',

    // statusFilter: ''
  },

  {
    id: 2,
    name: 'myTemplate',

    idFilter: '',
    nameFilter: 'w3sdesign',
    postalCodeFilter: '',
    cityFilter: 'vienna',
  },

];
