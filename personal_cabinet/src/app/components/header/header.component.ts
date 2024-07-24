import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { isOpenedClosedMenuAction } from '../../../store/app/app.actions';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IsOpenCloseService } from '../../services/is-open-close.service';
import { take, takeLast } from 'rxjs';

@Component({
  selector: 'cabinet-header',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isOpenMenu: boolean = false;
  isAuth = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private authService: AuthService,
    private isOpenCloseService: IsOpenCloseService
  ) {
    this.authService.isAuth$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isAuth) => (this.isAuth = isAuth));
  }

  ngOnInit() {
    this.isOpenCloseService.dataToggle
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.isOpenMenu = data['menu'];
      });
  }

  onClickLeaveHandler() {
    // this.store.dispatch(exitAction());
  }

  onIconHomeClickHandler() {
    this.isOpenCloseService.toggle('menu');
  }
}
