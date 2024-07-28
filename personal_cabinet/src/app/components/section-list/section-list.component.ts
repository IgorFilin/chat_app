import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
  imports: [CommonModule, IconComponent, RouterModule],
  templateUrl: './section-list.component.html',
  styleUrl: './section-list.component.scss',
})
export class SectionListComponent {
  sectionLists: WritableSignal<Array<ListType>> = signal([
    {
      icon: 'main',
      title: 'main (в разработке)',
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

  constructor(private route: Router) {}

  onClickListHandler(routeLink: string) {
    this.route.navigateByUrl(routeLink);
  }
}
