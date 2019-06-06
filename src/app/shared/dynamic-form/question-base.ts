/**
 * Form field metadata
 * for generating dynamic forms.
 */
export class QuestionBase {
  name = '';
  defaultValue ?: any = '';
  label ? = '';
  hint ? = '';
  tooltip ? = '';
  controlType = '';
  inputType ? = '';
  group?: 0 | 1 | 2 | 3 | 4 | 5 = 0; // 0 = no grouping; 1,2,3... = grouping
  groupName ? = '';
  order ? = 0;
  isRequired ? = false;
  isDisabled ? = false;
  isReadonly ? = false;

  nestedQuestions?: QuestionBase[] = [];

  options?: { key: string, value: string }[] = [];
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


