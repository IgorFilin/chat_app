import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({providedIn: 'root'})
export class PopupService {
  public isOpened: WritableSignal<boolean> = signal(false);

  constructor() {

   }

   openedClosedPopup() {
      this.isOpened.update((isOpened) => !isOpened)
   }
}
