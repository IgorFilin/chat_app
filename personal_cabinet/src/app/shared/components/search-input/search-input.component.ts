import { Component, Input, OnInit, Optional, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NgControl, ValidationErrors } from '@angular/forms';
import { FormErrorHandlerComponent } from '../form-error-handler/form-error-handler.component';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, debounce, debounceTime, distinctUntilChanged, Observable, Subject, tap } from 'rxjs';

@Component({
  standalone:true,
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  imports: [FormsModule, FormErrorHandlerComponent],
})
export class SearchInputComponent implements OnInit, ControlValueAccessor  {
  
  @Input() placeholder: string = '';
  @Input() errorMessage: string = '';
  @Input() searchedRequest$: (() => Observable<any>) | null = null;
  isLoadingData: boolean = false;
  value: string = '';
  valueSubject = new Subject()
  onTouch(isTouch: boolean) {}
  onChange(value: string) {}

  constructor(@Self() @Optional() private control: NgControl) {
    if (this.control) {
      this.control.valueAccessor = this;
    }
  }
  ngOnInit(): void {
    this.valueSubject.pipe(
      tap(() => this.isLoadingData = true),
      debounceTime(2000),
      distinctUntilChanged()
    ).subscribe((res) => {
      console.log('valueSubject', res);
      if (this.searchedRequest$) {
        this.searchedRequest$()
        .subscribe(res => {
          console.log('searchedRequest', res);
          this.isLoadingData = false;
        })
      }
    })
 
  }

  get invalid(): boolean | null {
    return this.control ? this.control.invalid : false;
  }

  public get showError(): boolean | null {
    if (!this.control) return false;
    const { dirty, touched } = this.control;
    return this.invalid ? dirty || touched : false;
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  handleBlur(): void {
    this.onTouch(true);
  }

  onChangeHandler(event: Event) {
    const value = (event.currentTarget as HTMLInputElement).value;
    this.valueSubject.next(value);
    this.onTouch(true);
    this.onChange(value);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!control.valid) return null;
    return {
      mustBePositive: {
        value,
      },
    };
  }

}
