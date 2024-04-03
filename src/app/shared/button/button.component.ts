import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() title!: string;
  @Input() link: string = '';
  @Input() mt: string = '0px';
  @Input() mr: string = '0px';
  @Input() mb: string = '0px';
  @Input() ml: string = '0px';

  constructor() {}

  ngOnInit(): void {}
}
