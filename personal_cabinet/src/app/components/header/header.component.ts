import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, DestroyRef, Inject, inject } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IsOpenCloseService } from '../../services/is-open-close.service';
import { ThemeService } from '../../services/theme.service';

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
  checked: boolean = false;

  constructor(
    private authService: AuthService,
    private isOpenCloseService: IsOpenCloseService,
    private themeService: ThemeService
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
    this.authService.exit();
  }

  onCheckHandler(event: any) {
    this.checked = event.target.checked;
    const theme = this.checked ? 'dark' : 'light';
    this.themeService.setTheme(theme);
  }

  onIconHomeClickHandler() {
    this.isOpenCloseService.toggle('menu');
  }
}
