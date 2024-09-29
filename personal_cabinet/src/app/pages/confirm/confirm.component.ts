import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormErrorHandlerComponent } from '../../shared/components/form-error-handler/form-error-handler.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { AuthService } from '../../services/auth.service';
import { IConfirm } from '../../models/request';

@Component({
  selector: 'cabinet-confirm',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormErrorHandlerComponent,
    InputComponent,
    RouterModule,
  ],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
})
export class ConfirmComponent {
  constructor(private authService: AuthService, private router: Router) {}

  confirmForm = new FormGroup({
    key: new FormControl('', Validators.required),
  });

  get key() {
    return this.confirmForm.get('key');
  }

  trackByIndex(index: number): number {
    return index;
  }

  onSubmit() {
    this.authService.confirm(this.confirmForm.value as IConfirm);
    this.confirmForm.reset();
  }
}
