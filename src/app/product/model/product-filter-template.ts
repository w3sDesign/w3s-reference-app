/**
 * Product filter template data definition.
 * ####################################################################
 * Includes all fields from `Product`.
 */

export class ProductFilterTemplate {

  id = 0;
  name = '';

  // Basic Data
  idFilter ?= '';
  nameFilter ?= '';
  typeFilter ?= '';
  statusFilter ?= '';
  commentFilter ?= '';
  creationDateFilter ?= '';

  // Main Address
  countryFilter ?= '';
  postalCodeFilter ?= '';
  cityFilter ?= '';
  streetFilter ?= '';

  // Main contact
  departmentFilter ?= '';
  personFilter ?= '';
  phoneFilter ?= '';
  emailFilter ?= '';
}


// export const productFilterMap = {
//   productId: 'id',
//   productName: 'name',
//   productStreet: 'addresses[0].street',
//   productPostalCode: 'addresses[0].postalCode',
//   productCity: 'addresses[0].city',
//   productCountry: 'addresses[0].country',
// };



