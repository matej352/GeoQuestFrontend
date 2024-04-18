import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ITestInstance } from 'src/app/models/test-instance';
import { TestInstanceService } from 'src/app/services/test-instance.service';

@Component({
  selector: 'app-my-exams-page',
  templateUrl: './my-exams-page.component.html',
  styleUrls: ['./my-exams-page.component.scss'],
})
export class MyExamsPageComponent implements OnInit {
  constructor(
    private _router: Router,
    private _testInstanceService: TestInstanceService
  ) {}

  tests$!: Observable<ITestInstance[]>;

  ngOnInit(): void {
    this.tests$ = this._testInstanceService.getTestInstances();
  }

  onPublish() {}
}
