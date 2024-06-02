import { Routes } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { component: RegistrationComponent, path: 'registration' },
  { component: LoginComponent, path: 'login' },
];
