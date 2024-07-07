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
import { registrationConfirm } from '../../../store/auth/auth.actions';

@Component({
  selector: 'cabinet-confirm',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormErrorHandlerComponent],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
})
export class ConfirmComponent {
  constructor(private store: Store, private router: Router) {}

  confirmForm = new FormGroup({
    key: new FormControl('', Validators.required),
  });

  dataConfirmPage: Array<{
    inputType: string;
    input: any;
    controlName: string;
    patternName?: string;
  }> = [
    {
      inputType: 'text',
      input: this.key,
      controlName: 'key',
    },
  ];

  get key() {
    return this.confirmForm.get('key');
  }

  trackByIndex(index: number): number {
    return index;
  }

  onRedirectForLogin() {
    this.router.navigateByUrl('login');
  }

  onSubmit() {
    this.store.dispatch(registrationConfirm(this.confirmForm.value));
    this.confirmForm.reset();
  }
}
