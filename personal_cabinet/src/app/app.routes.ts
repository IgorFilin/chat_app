import { Routes } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { LoginComponent } from './pages/login/login.component';
import { ConfirmComponent } from './pages/confirm/confirm.component';
import { authGuard } from './core/guard/auth-guard';
import { KnowledgeBaseComponent } from './pages/knowledgeBase/knowledgeBase.component';
import { QuestionsComponent } from './pages/questions/questions.component';

export const routes: Routes = [
  { component: RegistrationComponent, path: 'registration' },
  { component: LoginComponent, path: 'login' },
  { component: ConfirmComponent, path: 'confirm' },
  {
    redirectTo: 'questions',
    path: '',
    pathMatch: 'full',
  },
  {
    component: QuestionsComponent,
    path: 'questions',
    canActivate: [authGuard],
  },
  {
    component: KnowledgeBaseComponent,
    path: 'knowledgeBase',
    canActivate: [authGuard],
  },
];
