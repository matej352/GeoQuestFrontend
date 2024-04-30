import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Observable, concatMap, tap } from 'rxjs';
import { ITaskDto } from 'src/app/models/taskDto';
import { ITest } from 'src/app/models/test';
import { TaskService } from 'src/app/services/task.service';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-draft-exam',
  templateUrl: './draft-exam.component.html',
  styleUrls: ['./draft-exam.component.scss'],
})
export class DraftExamComponent implements OnInit {
  //icons
  public back = faArrowAltCircleLeft;

  testId!: number;

  tasks$!: Observable<ITaskDto[]>;
  test$!: Observable<ITest>;

  createTaskOpened = false;

  constructor(
    private _taskService: TaskService,
    private _testService: TestService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._route.paramMap
      .pipe(
        tap((res: ParamMap) => {
          this.testId = +res.get('testId')!;
          this.test$ = this._testService.getTest(this.testId);
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
}
