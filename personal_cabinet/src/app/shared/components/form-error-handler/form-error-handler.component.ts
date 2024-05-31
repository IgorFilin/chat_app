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
  @Input() patternName?: 'email';

  errors: string[] = [];

  errorDescriptions: Record<string, string> = {
    maxlength: 'Пароль слишком длинный',
    minlength: 'Пароль слишком короткий',
    required: 'Обязательное поле',
    email: 'Некорректный почтовый адрес',
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
