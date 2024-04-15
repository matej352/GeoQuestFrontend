import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DropdownComponent,
    },
  ],
})
export class DropdownComponent implements OnInit, ControlValueAccessor {
  @Input()
  list$: Observable<[{ id: number; name: string }]> | any | undefined;

  selectedDropdownOptionId!: number;

  constructor() {}

  touched = false;
  disabled = false;

  //callback functions

  onChange = (selectedDropdownOptionId: number) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    if (value) {
      this.selectedDropdownOptionId = value;
    }
  }
  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }
  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  ngOnInit(): void {}

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  onOpen() {
    this.markAsTouched();
  }

  onSelect(id: number) {
    let el = document.getElementsByClassName('custom-select')[0];
    el.removeAttribute('open');

    this.onChange(id);

    this.selectedDropdownOptionId = id;
  }
}
