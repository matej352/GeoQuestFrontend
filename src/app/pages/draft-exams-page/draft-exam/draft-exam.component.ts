import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  faArrowAltCircleLeft,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import {
  EMPTY,
  Observable,
  Subscription,
  catchError,
  concatMap,
  take,
  tap,
} from 'rxjs';
import { ITaskDto } from 'src/app/models/taskDto';
import { ITest } from 'src/app/models/test';
import { DialogOpenerService } from 'src/app/services/dialog-services/dialog-opener.service';
import { TaskService } from 'src/app/services/task.service';
import { TestService } from 'src/app/services/test.service';
import { YesNoDialogComponent } from 'src/app/shared/dialogs/confirm-leave-ongoing-exam-dialog/confirm-leave-ongoing-exam-dialog.component';

@Component({
  selector: 'app-draft-exam',
  templateUrl: './draft-exam.component.html',
  styleUrls: ['./draft-exam.component.scss'],
})
export class DraftExamComponent implements OnInit, OnDestroy {
  //icons
  public back = faArrowAltCircleLeft;
  public editIcon = faEdit;

  testId!: number;

  tasks$!: Observable<ITaskDto[]>;
  test$!: Observable<ITest>;

  test!: ITest;
  subscription!: Subscription;

  createTaskOpened = false;

  constructor(
    private _taskService: TaskService,
    private _testService: TestService,
    private _route: ActivatedRoute,
    private _dialogOpenerService: DialogOpenerService,
    private _router: Router,
    private dialog: MatDialog
  ) {
    this.subscription = this._dialogOpenerService.addExamDialogResult$
      .asObservable()
      .subscribe((result) => {
        if (result.updated) {
          this.test$ = this._testService
            .getTest(this.testId)
            .pipe(tap((test) => (this.test = test)));
        }
      });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this._route.paramMap
      .pipe(
        tap((res: ParamMap) => {
          this.testId = +res.get('testId')!;
          this.test$ = this._testService
            .getTest(this.testId)
            .pipe(tap((test) => (this.test = test)));
          this.tasks$ = this._taskService.getTasks(this.testId);
        })
      )
      .subscribe();
  }

  createTask() {
    this.createTaskOpened = true;
    setTimeout(() => {
      let el = document.getElementById('newTask');
      el?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 1);
  }

  onTaskCreated(isCreated: boolean) {
    this.createTaskOpened = false;

    if (isCreated) {
      this.tasks$ = this._taskService.getTasks(this.testId).pipe(
        tap((tasks: ITaskDto[]) => {
          setTimeout(() => {
            let elementId = tasks.at(tasks.length - 1)?.id;
            if (elementId) {
              let el = document.getElementsByClassName(
                'task' + elementId.toString()
              )[0];
              el?.scrollIntoView({
                behavior: 'smooth',
              });
            }
          }, 10);
        })
      );

      this.test$ = this._testService
        .getTest(this.testId)
        .pipe(tap((test) => (this.test = test)));
    }
  }

  onTaskDeleted() {
    this.tasks$ = this._taskService.getTasks(this.testId);
    this.test$ = this._testService
      .getTest(this.testId)
      .pipe(tap((test) => (this.test = test)));
  }

  edit() {
    this._dialogOpenerService.openAddExamDialog(this.test);
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
