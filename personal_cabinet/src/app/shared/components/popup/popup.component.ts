import { Component, OnInit } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { PopupService } from '../../../services/popup.service';

@Component({
    selector: 'app-popup',
    imports: [IconComponent],
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  constructor(
    private popupService: PopupService
  ) { }

  ngOnInit() {
  }

  close() {
    this.popupService.openedClosedPopup()
  }
}
