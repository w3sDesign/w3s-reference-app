/**
 * Customer filter template data definition.
 * ####################################################################
 * Includes all fields from `Customer`.
 * A filterTemplate is a predefined set of filters, which can be created,
 * retrieved, updated, and deleted.
 */

export class CustomerFilterTemplate {

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

