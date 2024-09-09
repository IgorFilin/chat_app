import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: InputComponent,
    },
  ],
})
export class InputComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() type: string = 'email';
  value: string = '';
  isDisabled: boolean = false;
  isTouched: boolean = false;
  onTouched(value: boolean) {}
  onChange(value: string) {}

  constructor() {}

  writeValue(value: string): void {
    console.log('writeValue', value);
    this.value = value;
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChangeHandler(event: Event) {
    const value = (event.currentTarget as HTMLInputElement).value;
    if (!this.isTouched) this.onTouched(true);
    this.onChange(value);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value.valid) return null;
    return {
      mustBePositive: {
        value,
      },
    };
  }

  ngOnInit() {}
}
