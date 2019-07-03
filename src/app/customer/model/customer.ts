export interface Address {
  // type?: AddAddressType = other;
  country: string;
  street: string;
  postalCode: string;
  city: string;
}

// TODO
export type CustomerType = 'business' | 'individual' | 'other' | '';
export type CustomerStatus = 'active' | 'suspended' | 'pending' | '';

export type AddAddressType = 'shipping' | 'billing' | 'other';


/**
 * Customer data definition.
 * ####################################################################
 */

export class Customer {
  // Basic Data
  id = 0;
  name = '';
  type?: CustomerType = 'business';
  status?: CustomerStatus = 'active';

  homepage ?= '';
  comment ?= '';
  creationDate ?= '';


  // Main address
  country ?= '';
  postalCode ?= '';
  city ?= '';
  street ?= '';

  // Additional Addresses
  addAddresses?: any[];

  // Main contact
  department ?= '';
  person ?= '';
  phone ?= '';
  email ?= '';

  // Additional Contacts
  // contacts?: Contact[] = [];
}



