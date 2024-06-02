import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getIsAuth } from '../../../store/auth/auth.selector';
import { exitAction } from '../../../store/auth/auth.actions';

@Component({
  selector: 'cabinet-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private store: Store) {}

  isAuth = this.store.select(getIsAuth);

  onClickLeaveHandler() {
    this.store.dispatch(exitAction());
  }
}
