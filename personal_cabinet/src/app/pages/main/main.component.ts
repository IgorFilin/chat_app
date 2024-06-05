import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GetIsStatusMenu } from '../../../store/app/app.selector';
import { CommonModule } from '@angular/common';
import { SectionListComponent } from '../../components/section-list/section-list.component';
import { RouterModule } from '@angular/router';
import { slideInOutAnimation } from '../../animations/slide-in-out-animations';

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

  constructor(private store: Store) {}

  ngOnInit() {
    console.log('tet');
    this.isOpenMenu = this.store.select(GetIsStatusMenu);
  }
}
