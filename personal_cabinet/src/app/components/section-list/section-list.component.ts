import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'cabinet-section-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-list.component.html',
  styleUrl: './section-list.component.scss',
})
export class SectionListComponent {
  constructor(private route: Router) {}

  sectionLists: Array<{ title: string; routeLink: string }> = [
    {
      title: 'main',
      routeLink: '/',
    },
    {
      title: 'bot-questions',
      routeLink: 'bot-questions',
    },
  ];

  onClickListHandler(routeLink: string) {
    this.route.navigateByUrl(routeLink);
  }
}
