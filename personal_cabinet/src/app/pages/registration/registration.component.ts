import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorHandlerComponent } from '../../shared/components/form-error-handler/form-error-handler.component';
import { Store } from '@ngrx/store';
import { startRegistrationAction } from '../../../store/auth/auth.actions';

@Component({
  selector: 'cabinet-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormErrorHandlerComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  constructor(private store: Store) {}

  registrationForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u
      ),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  dataRegisterPage: Array<{
    inputType: string;
    input: any;
    controlName: string;
    patternName?: string;
  }> = [
    {
      inputType: 'text',
      input: this.name,
      controlName: 'name',
    },
    {
      inputType: 'email',
      input: this.email,
      patternName: 'email',
      controlName: 'email',
    },
    {
      inputType: 'password',
      input: this.password,
      controlName: 'password',
    },
  ];

  get name() {
    return this.registrationForm.get('name');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get password() {
    return this.registrationForm.get('password');
  }

  trackByIndex(index: number): number {
    return index;
  }

  onSubmit() {
    this.store.dispatch(startRegistrationAction(this.registrationForm.value));
    this.registrationForm.reset();
  }
}
