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

  errors: string[] = [];

  errorDescriptions: Record<string, string> = {
    maxlength: 'Пароль слишком длинный',
    minlength: 'Пароль слишком короткий',
    required: 'Обязательное поле',
  };

  ngOnInit(): void {
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
