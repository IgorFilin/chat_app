import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() placeholder: string = 'логин';

  constructor() {}

  ngOnInit() {}
}
