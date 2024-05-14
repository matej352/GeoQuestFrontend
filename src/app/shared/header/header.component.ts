import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() text1: string = '';
  @Input() highlitedText: string = '';
  @Input() text2: string = '';

  @Input() height: string = '60px';

  constructor() {}

  ngOnInit(): void {}
}
