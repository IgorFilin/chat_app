import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
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
  imports: [CommonModule, IconComponent, RouterModule, RouterLinkActive],
  templateUrl: './section-list.component.html',
  styleUrl: './section-list.component.scss',
})
export class SectionListComponent {
  sectionLists: WritableSignal<Array<ListType>> = signal([
    {
      icon: 'main',
      title: 'Главная (в разработке)',
      routeLink: '/',
      disabled: true,
    },
    {
      icon: 'bot',
      title: 'Создать вопрос',
      routeLink: '/questions',
      disabled: false,
    },
    {
      icon: 'knowledgeBase',
      title: 'База знаний',
      routeLink: '/knowledgeBase',
      disabled: false,
    },
  ]);

  constructor(private route: Router) {
    console.log(this.route);
  }
}
