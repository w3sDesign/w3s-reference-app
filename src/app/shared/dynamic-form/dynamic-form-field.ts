export class DynamicFormField {
  controlType = '';
  id = ''; // key
  value?: any;
  label? = '';
  required? = false;
  inputType? = '';
  selectOptions?: { key: string, value: string }[] = [];
  templateRefVar? = '';
  order? = 0;
}


// export class FormFieldBase<T> {
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


