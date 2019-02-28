/**
 * Form field metadata
 * for generating form fields dynamically.
 */
export class QuestionBase {
  key = '';
  value?: any;
  label?= '';
  controlType = '';
  inputType?= '';
  options?: { key: string, value: string }[] = [];
  templateRefVar?= '';
  required?= false;
  order?= 0;
}


// export class FieldBase<T> {
//   value: T;
//   key: string;
//   label: string;
//   required: boolean;
//   order: number;
//   controlType: string;

//   constructor(options: {
//     value?: T,
//     key?: string,
//     label?: string,
//     required?: boolean,
//     order?: number,
//     controlType?: string
//   } = {}) {
//     this.value = options.value;
//     this.key = options.key || '';
//     this.label = options.label || '';
//     this.required = !!options.required;
//     this.order = options.order === undefined ? 1 : options.order;
//     this.controlType = options.controlType || '';
//   }
// }

