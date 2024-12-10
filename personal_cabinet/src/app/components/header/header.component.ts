import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, DestroyRef, Inject, inject } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IsOpenCloseService } from '../../services/is-open-close.service';
import { ThemeService } from '../../services/theme.service';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { KnowledgeService } from '../../services/knowledge.service';
import { bubbleAnimation } from '../../animations/bubble.animation';

@Component({
  selector: 'cabinet-header',
  standalone: true,
  imports: [CommonModule, IconComponent, SearchInputComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [],
})
export class HeaderComponent {
  isOpenMenu: boolean = false;
  isAuth = false;
  destroyRef = inject(DestroyRef);
  checked: boolean = false;
  currentRoute: string = '';
  searchedArticles:any = [];

  constructor(
    private authService: AuthService,
    private isOpenCloseService: IsOpenCloseService,
    private themeService: ThemeService,
    private router: Router,
    private knowledgeService: KnowledgeService
  ) {
    this.checked = this.themeService.getCurrentTheme === 'dark';
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

      // Поток данных роута, и когда событие NavigationEnd мы устанавливает роут, что бы поймать актуальный
      this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.currentRoute = this.router.url
      })
  }

  onSearchArticles: any = (searchValue: string) => {
    if(!searchValue) this.searchedArticles = [] 
    else this.searchedArticles = this.knowledgeService.articles.filter((article) => article.title.includes(searchValue));
  }

  onClickLeaveHandler() {
    this.isOpenCloseService.reset()
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
