import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';
import { SectionListComponent } from './components/section-list/section-list.component';
import { Observable } from 'rxjs';
import { IsOpenCloseService } from './services/is-open-close.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { slideInOutAnimation } from './animations/slide-in-out-animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RegistrationComponent,
    LoginComponent,
    HeaderComponent,
    SectionListComponent,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [slideInOutAnimation],
})
export class AppComponent implements OnInit {
  title = 'personal_cabinet';
  isOpenMenu: boolean | null = null;
  htmlRef: any;
  constructor(
    private authService: AuthService,
    public loadingService: LoadingService,
    private isOpenCloseService: IsOpenCloseService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.htmlRef = this.document.querySelector('html');
  }

  ngOnInit() {
    this.authService.authRequest().subscribe();
    this.isOpenCloseService.dataToggle.subscribe((data) => {
      this.isOpenMenu = data['menu'];
    });
  }

  toggle() {
    const currentTheme = this.htmlRef.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      this.htmlRef.setAttribute('data-theme', 'light');
    } else {
      this.htmlRef.setAttribute('data-theme', 'dark');
    }
  }
}
