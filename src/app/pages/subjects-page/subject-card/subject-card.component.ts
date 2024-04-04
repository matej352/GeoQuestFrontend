import { Component, Input, OnInit } from '@angular/core';
import { ISubject } from 'src/app/models/subject';

@Component({
  selector: 'app-subject-card',
  templateUrl: './subject-card.component.html',
  styleUrls: ['./subject-card.component.scss'],
})
export class SubjectCardComponent implements OnInit {
  @Input()
  subject!: ISubject;

  constructor() {}

  ngOnInit(): void {}
}
