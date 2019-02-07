import { DynamicFormField } from './dynamic-form-field';

/**
 * Interface - Getting the form fields for building a form dynamically.
 */
export abstract class DynamicFormService {

  abstract getDynamicFormFields(): DynamicFormField[];

}
