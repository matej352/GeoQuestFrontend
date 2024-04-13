import { Component, Input, OnInit } from '@angular/core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements OnInit {
  @Input()
  message!: string;

  //icons
  infoIcon = faInfoCircle;

  constructor() {}

  ngOnInit(): void {}

  createMessage(message: string): string {
    return message;
  }
}
