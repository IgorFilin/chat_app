import { Routes } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { LoginComponent } from './pages/login/login.component';
import { ConfirmComponent } from './pages/confirm/confirm.component';
import { MainComponent } from './pages/main/main.component';
import { authGuard } from './core/guard/auth-guard';
import { QuestionsBotComponent } from './components/questions-bot/questions-bot.component';

export const routes: Routes = [
  { component: RegistrationComponent, path: 'registration' },
  { component: LoginComponent, path: 'login' },
  { component: ConfirmComponent, path: 'confirm' },
  {
    component: MainComponent,
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'bot-questions',
        component: QuestionsBotComponent,
      },
    ],
  },
];
