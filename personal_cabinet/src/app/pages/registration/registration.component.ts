import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorHandlerComponent } from '../../shared/components/form-error-handler/form-error-handler.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormErrorHandlerComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.minLength(6),
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

  get name() {
    return this.registrationForm.get('name');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get password() {
    return this.registrationForm.get('password');
  }

  ngOnInit(): void {
    this.registrationForm.valueChanges.subscribe((data) => {
      // const validationsObj = {
      //   name: this.registrationForm.get('name')?.errors,
      //   email: this.registrationForm.get('email')?.errors,
      //   password: this.registrationForm.get('password')?.errors,
      // };
      // console.log(validationsObj);
    });
  }
}
