import { DynamicField } from './dynamic-field';

/**
 * Interface - Getting the form fields for building a form dynamically.
 */
export abstract class DynamicFieldService {

  abstract getFields(): DynamicField[];

}
