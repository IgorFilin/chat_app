import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface ListType {
  title: string;
  routeLink: string;
  icon: string;
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

  sectionLists: Array<ListType> = [
    {
      icon: 'main',
      title: 'main',
      routeLink: '/',
    },
    {
      icon: 'bot',
      title: 'bot',
      routeLink: 'bot-questions',
    },
  ];

  onClickListHandler(routeLink: string) {
    this.route.navigateByUrl(routeLink);
  }
}
