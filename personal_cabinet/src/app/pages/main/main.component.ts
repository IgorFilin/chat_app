import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SectionListComponent } from '../../components/section-list/section-list.component';
import { RouterModule } from '@angular/router';
import { slideInOutAnimation } from '../../animations/slide-in-out-animations';
import { IsOpenCloseService } from '../../services/is-open-close.service';

@Component({
  selector: 'cabinet-main',
  standalone: true,
  imports: [CommonModule, SectionListComponent, RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  animations: [slideInOutAnimation],
})
export class MainComponent implements OnInit {
  isOpenMenu: Observable<boolean> | null = null;

  constructor(private isOpenCloseService: IsOpenCloseService) {}

  ngOnInit() {
    this.isOpenCloseService.dataToggle.subscribe((data) => {
      this.isOpenMenu = data['menu'];
    });
  }
}
