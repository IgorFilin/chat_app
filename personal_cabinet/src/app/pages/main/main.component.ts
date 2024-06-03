import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GetIsStatusMenu } from '../../../store/app/app.selector';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cabinet-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  isOpenMenu: Observable<boolean> | null = null;

  constructor(private store: Store) {}

  ngOnInit() {
    this.isOpenMenu = this.store.select(GetIsStatusMenu);
  }
}
