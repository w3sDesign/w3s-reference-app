// NEW

import { QuestionBase } from '../../shared/dynamic-form/question-base';
import { betweenDateValidator } from '../../shared/form-validators/between-date.directive';
import { Validators } from '@angular/forms';

import * as moment from 'moment';
////////////////////
moment.locale('de');
////////////////////

/**
 * Questions about the input fields in a filter template.
 * ######################################################
 */

export const customerFilterTemplateQuestions: QuestionBase[] = [

  // First question / input field (internal filter template id).
  {
    name: 'id',
    controlType: 'textbox',
    inputType: 'number',
    isDisabled: true,
  },
  // Second question / input field (internal filter template name).
  {
    name: 'name',
    controlType: 'textbox',
    inputType: 'text',
    isDisabled: true,
  },
  // Third question / input field (customer id filter), etc.
  {
    name: 'idFilter',
    controlType: 'textbox',
    inputType: 'text',
    label: '',
    hint: 'Filter by Id',
    tooltip: 'For example: 1000 (=equal), <1000 (=lower), >1000 (=greater), 1000-2000 (=between)'
  },
  {
    name: 'nameFilter',
    controlType: 'textbox',
    inputType: 'text',
    label: '',
    hint: 'Filter by Name',
  },
  {
    name: 'typeFilter',
    controlType: 'dropdown',
    inputType: '',
    label: '',
    hint: 'Filter by Type',
    options: [
      { key: 'business', value: 'Business' },
      { key: 'individual', value: 'Individual' },
      { key: 'other', value: 'Other' },
    ],
 },
  {
    name: 'statusFilter',
    controlType: 'dropdown',
    inputType: '',
    label: '',
    hint: 'Filter by Status',
    options: [
      { key: 'active', value: 'Active' },
      { key: 'suspended', value: 'Suspended' },
      { key: 'pending', value: 'Pending' },
      // { key: 'unproven', value: 'Unproven' }
    ],
  },
  {
    name: 'commentFilter',
    controlType: 'textbox',
    inputType: 'text',
    label: '',
    hint: 'Filter by Comment',
  },
  {
    name: 'creationDateFilter',
    controlType: 'textbox',
    inputType: 'date',
    label: '',
    hint: 'Filter by Creation Date',
    tooltip: 'For example: 01.01.2020 (=equal), <01.01.2020 (=lower), >01.01.2020 (=greater), 01.01.2020-31.12.2020 (=between)'
  },
  {
    name: 'countryFilter',
    controlType: 'textbox',
    inputType: 'text',
    label: '',
    hint: 'Filter by Country',
  },
  {
    name: 'postalCodeFilter',
    controlType: 'textbox',
    inputType: 'text',
    label: '',
    hint: 'Filter by Postal Code',
  },
  {
    name: 'cityFilter',
    controlType: 'textbox',
    inputType: 'text',
    label: '',
    hint: 'Filter by City',
  },
  {
    name: 'streetFilter',
    controlType: 'textbox',
    inputType: 'text',
    label: '',
    hint: 'Filter by Street',
  },
  {
    name: 'departmentFilter',
    controlType: 'textbox',
    inputType: 'text',
    label: '',
    hint: 'Filter by Contact Department',
  },
  {
    name: 'personFilter',
    controlType: 'textbox',
    inputType: 'text',
    label: '',
    hint: 'Filter by Contact Person',
  },
  {
    name: 'phoneFilter',
    controlType: 'textbox',
    inputType: 'text',
    label: '',
    hint: 'Filter by Contact Phone',
  },
  {
    name: 'emailFilter',
    controlType: 'textbox',
    inputType: 'email',
    label: '',
    hint: 'Filter by Contact Email',
  },

];
