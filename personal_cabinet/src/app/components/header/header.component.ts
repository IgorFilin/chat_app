import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getIsAuth } from '../../../store/auth/auth.selector';
import { exitAction } from '../../../store/auth/auth.actions';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { isOpenedClosedMenuAction } from '../../../store/app/app.actions';

@Component({
  selector: 'cabinet-header',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private store: Store) {}

  isOpenMenu: boolean = false;
  isAuth = this.store.select(getIsAuth);

  onClickLeaveHandler() {
    this.store.dispatch(exitAction());
  }

  onIconHomeClickHandler() {
    this.isOpenMenu = !this.isOpenMenu;
    this.store.dispatch(isOpenedClosedMenuAction(this.isOpenMenu));
  }
}
