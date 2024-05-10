import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  faArrowAltCircleLeft,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription, concatMap, tap } from 'rxjs';
import { ITaskDto } from 'src/app/models/taskDto';
import { ITest } from 'src/app/models/test';
import { DialogOpenerService } from 'src/app/services/dialog-services/dialog-opener.service';
import { TaskService } from 'src/app/services/task.service';
import { TestService } from 'src/app/services/test.service';

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
    private _dialogOpenerService: DialogOpenerService
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

  onTaskCreated() {
    this.createTaskOpened = false;
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
  }

  edit() {
    this._dialogOpenerService.openAddExamDialog(this.test);
  }
}
