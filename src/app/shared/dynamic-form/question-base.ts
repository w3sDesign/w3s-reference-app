/**
 * Form field metadata
 * for generating dynamic forms.
 */
export class QuestionBase {
  key = '';
  value?: any;
  label? = '';
  controlType = '';
  inputType? = '';
  group?: 0 | 1 | 2 | 3 = 0; // 0 = no grouping; 1,2,3... = grouping
  groupName? = '';
  order? = 0;
  required? = false;
  isDisabled? = false;

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


