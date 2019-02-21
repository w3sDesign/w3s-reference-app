import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicField } from '../../shared/dynamic-form/dynamic-field';
import { DynamicFormGroupService } from '../../shared/dynamic-form/dynamic-form-group.service';
import { DynamicFilterFieldService } from '../dynamic-form/dynamic-filter-field.service';

@Component({
  selector: 'app-filter-detail',
  templateUrl: './filter-detail.component.html',
  styleUrls: ['./filter-detail.component.scss'],
  providers: [DynamicFormGroupService]
})
export class FilterDetailComponent implements OnInit {

  // @Input() dynamicFields: DynamicField[] = [];
  // @Output() dynamicFormSubmit: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  payLoad = '';

  dynFields: DynamicField[];

  constructor(
    private dynFormGroupService: DynamicFormGroupService,
    private dynService: DynamicFilterFieldService,
  ) {
    /** Getting the filter fields dynamically. */
    this.dynFields = dynService.getFields();
  }

  ngOnInit() {
    this.form = this.dynFormGroupService.createFormGroup(this.dynFields);
  }

  onSubmit() {
    // this.dynamicFormSubmit.emit(this.form.value);
    // // this.payLoad = this.form.value;
    this.payLoad = JSON.stringify(this.form.value);
  }

  onDynamicFilterFormSubmit(value) {
    // this.filterFormValue = value;
    // this.loadCustomers();
  }

}
