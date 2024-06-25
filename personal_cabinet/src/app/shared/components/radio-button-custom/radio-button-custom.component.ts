import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  standalone:true,
  selector: 'app-radio-button-custom',
  templateUrl: './radio-button-custom.component.html',
  styleUrls: ['./radio-button-custom.component.scss'],
  imports:[CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonCustomComponent),
      multi:true
    }
  ]
})
export class RadioButtonCustomComponent implements ControlValueAccessor,  OnInit
{

  @Input() options:any[] = []

  private _value:any
  constructor() {}

  private onChange = (value:any) => {}
  private onTouched = () => {}

  ngOnInit() {}

  get customValue() {
    return this._value
  }

  set customValue(value:any) {
    this._value = value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  writeValue(value: any): void {
    console.log(value)
    this._value = value
  }

  onChangeHandler(event:Event) {
    const {value} = event.currentTarget as HTMLInputElement
    this.onChange(value)
    this.customValue = value
    this.onTouched();
  }

}
