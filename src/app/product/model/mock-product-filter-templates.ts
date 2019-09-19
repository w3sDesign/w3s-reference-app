import { ProductFilterTemplate } from './product-filter-template';

export const mockProductFilterTemplates: ProductFilterTemplate[] = [
  {
    // Empty filter template.
    id: 0,
    name: '',
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
