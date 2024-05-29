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
    email: new FormControl(''),
    password: new FormControl(''),
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
