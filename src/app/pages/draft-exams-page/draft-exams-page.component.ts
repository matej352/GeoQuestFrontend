import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, Subscription, catchError } from 'rxjs';
import { ITest } from 'src/app/models/test';
import { DialogOpenerService } from 'src/app/services/dialog-services/dialog-opener.service';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-draft-exams-page',
  templateUrl: './draft-exams-page.component.html',
  styleUrls: ['./draft-exams-page.component.scss'],
})
export class DraftExamsPageComponent implements OnInit {
  subscription!: Subscription;

  constructor(
    private _router: Router,
    private _testService: TestService,
    private _dialogOpenerService: DialogOpenerService
  ) {
    this.subscription = this._dialogOpenerService.addExamDialogResult$
      .asObservable()
      .subscribe((result) => {
        if (result.created) {
          this.tests$ = this._testService.getTests();
        }
      });
  }

  tests$!: Observable<ITest[]>;

  ngOnInit(): void {
    this.tests$ = this._testService.getTests();
  }

  onCreateExam() {
    this._dialogOpenerService.openAddExamDialog();
  }

  onPublish(testId: number) {
    this._testService
      .publishTest(testId)
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe();
  }
}
