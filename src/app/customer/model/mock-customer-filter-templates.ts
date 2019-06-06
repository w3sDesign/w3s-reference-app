import { CustomerFilterTemplate } from './customer-filter-template';

export const mockCustomerFilterTemplates: CustomerFilterTemplate[] = [
  {
    id: 0,
    name: '', // empty template

    idFilter: '',
    nameFilter: '',
  },
  {
    id: 1,
    name: 'standard',

    idFilter: '>20010',
    nameFilter: 'Foundation',

  },

  {
    id: 2,
    name: 'myTemplate',

    nameFilter: 'consulting',
    countryFilter: 'state',
    postalCodeFilter: '',
  },

];
