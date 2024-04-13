import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ITest } from 'src/app/models/test';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-exams-page',
  templateUrl: './exams-page.component.html',
  styleUrls: ['./exams-page.component.scss'],
})
export class ExamsPageComponent implements OnInit {
  constructor(private _router: Router, private _testService: TestService) {}

  tests$!: Observable<ITest[]>;

  ngOnInit(): void {
    this.tests$ = this._testService.getTests();
  }

  onCreateExam() {
    this._router.navigate(['teacher', 'exams', 'new']);
  }
}
