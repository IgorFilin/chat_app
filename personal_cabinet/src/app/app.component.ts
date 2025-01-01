import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LoadingService } from './services/loading.service';
import { SectionListComponent } from './components/section-list/section-list.component';
import { IsOpenCloseService } from './services/is-open-close.service';
import { CommonModule } from '@angular/common';
import { slideInOutAnimation } from './animations/slide-in-out.animations';
import { UserStore } from './store/user/user.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
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
    public loadingService: LoadingService,
    private isOpenCloseService: IsOpenCloseService,
  ) {}

  ngOnInit() {
    this.isOpenCloseService.dataToggle.subscribe((data) => {
      this.isOpenMenu = data['menu'];
    });
  }
}
