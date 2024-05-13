import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EMPTY, Observable, Subscription, catchError, take, tap } from 'rxjs';
import { ITest } from 'src/app/models/test';
import { DialogOpenerService } from 'src/app/services/dialog-services/dialog-opener.service';
import { TestService } from 'src/app/services/test.service';
import { YesNoDialogComponent } from 'src/app/shared/dialogs/confirm-leave-ongoing-exam-dialog/confirm-leave-ongoing-exam-dialog.component';

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
    private _dialogOpenerService: DialogOpenerService,
    private dialog: MatDialog
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
    const dialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
        title: 'Potvrdite objavu skice ispita',
        description:
          'Objavom skice ispita, skica će se arhivirati, a svi učenici na predmetu će dobiti ispit te će moći započeti njegovo rješavanje. Jeste li sigurni da želite objaviti skicu ispita?',
      },
      width: '900px',
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        tap((trueOrFlase: boolean) => {
          if (trueOrFlase == true) {
            this._testService
              .publishTest(testId)
              .pipe(
                catchError((err) => {
                  console.log(err);
                  return EMPTY;
                })
              )
              .subscribe((testInstanceBaseId) => {
                this._router.navigateByUrl(
                  `/teacher/exams/exam/${testInstanceBaseId}`
                );
              });
          }
        })
      )
      .subscribe();
  }
}
