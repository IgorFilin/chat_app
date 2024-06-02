import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-form-error-handler',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-error-handler.component.html',
  styleUrl: './form-error-handler.component.scss',
})
export class FormErrorHandlerComponent implements OnInit {
  @Input() errorFormObject?: any;
  @Input() patternName?: string;

  errors: string[] = [];

  errorDescriptions: Record<string, string> = {
    maxlength: 'The field must be shorter',
    minlength: 'Please enter more characters',
    required: 'This field is required',
    email: 'Invalid email address',
  };

  ngOnInit(): void {
    if (this.patternName) {
      this.errorDescriptions = {
        ...this.errorDescriptions,
      };
      this.errorDescriptions['pattern'] =
        this.errorDescriptions[this.patternName];
      delete this.errorDescriptions[this.patternName];
    }
    if (this.errorFormObject) {
      this.errorFormObject.valueChanges.subscribe(() => {
        if (this.errorFormObject!.errors) {
          this.errors = Object.keys(this.errorFormObject!.errors);
        }
        if (!this.errorFormObject!.errors && this.errors.length) {
          this.errors = [];
        }
      });
    }
  }
}
