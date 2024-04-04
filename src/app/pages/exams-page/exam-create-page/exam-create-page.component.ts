import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam-create-page',
  templateUrl: './exam-create-page.component.html',
  styleUrls: ['./exam-create-page.component.scss'],
})
export class ExamCreatePageComponent implements OnInit {
  constructor(private _router: Router) {}

  ngOnInit(): void {}
}
