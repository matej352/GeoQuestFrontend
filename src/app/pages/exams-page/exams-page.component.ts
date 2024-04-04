import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exams-page',
  templateUrl: './exams-page.component.html',
  styleUrls: ['./exams-page.component.scss'],
})
export class ExamsPageComponent implements OnInit {
  constructor(private _router: Router) {}

  ngOnInit(): void {}

  onCreateExam() {
    this._router.navigate(['teacher', 'exams', 'new']);
  }
}
