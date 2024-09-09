import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormErrorHandlerComponent } from '../../shared/components/form-error-handler/form-error-handler.component';
import { startLogin } from '../../../store/auth/auth.actions';
import { AuthService } from '../../services/auth.service';
import { InputComponent } from '../../shared/components/input/input.component';

@Component({
  selector: 'cabinet-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormErrorHandlerComponent,
    InputComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private router: Router, private authServise: AuthService) {}
  loginForm: FormGroup = new FormGroup({
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

  dataLoginPage: Array<{
    inputType: string;
    input: any;
    controlName: string;
    patternName?: string;
  }> = [
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

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  trackByIndex(index: number): number {
    return index;
  }

  onRedirectForLogin() {
    this.router.navigateByUrl('registration');
  }

  onRedirectForConfirm() {
    this.router.navigateByUrl('confirm');
  }

  onSubmit() {
    this.authServise.login(this.loginForm.getRawValue());
    this.loginForm.reset();
  }
}
