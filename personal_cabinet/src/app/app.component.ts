import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { LoginComponent } from './pages/login/login.component';
import { Store } from '@ngrx/store';
import { authAction } from '../store/auth/auth.actions';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RegistrationComponent,
    LoginComponent,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  title = 'personal_cabinet';

  ngOnInit() {
    this.store.dispatch(authAction());
  }
}
