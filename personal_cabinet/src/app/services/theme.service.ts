import { Inject, Injectable } from '@angular/core';
import { ThemeType } from '../models/types';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private htmlRef: HTMLElement;
  private currentTheme = '';

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.htmlRef = this.document.querySelector('html')!;
  }

  setTheme(theme: ThemeType) {
    if (theme === 'dark') this.htmlRef.setAttribute('data-theme', 'dark');
    else this.htmlRef.setAttribute('data-theme', 'light');
  }
}
