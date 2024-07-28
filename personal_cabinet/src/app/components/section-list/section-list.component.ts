import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface ListType {
  title: string;
  routeLink: string;
  icon: string;
  disabled: boolean;
}
@Component({
  selector: 'cabinet-section-list',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './section-list.component.html',
  styleUrl: './section-list.component.scss',
})
export class SectionListComponent {
  constructor(private route: Router) {}

  sectionLists: WritableSignal<Array<ListType>> = signal([
    {
      icon: 'main',
      title: 'main',
      routeLink: '/',
      disabled: true,
    },
    {
      icon: 'bot',
      title: 'bot',
      routeLink: 'bot-questions',
      disabled: false,
    },
  ]);

  onClickListHandler(routeLink: string) {
    this.route.navigateByUrl(routeLink);
  }
}
