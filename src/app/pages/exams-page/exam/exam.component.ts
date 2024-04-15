import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, concatMap, tap } from 'rxjs';
import { ITaskDto } from 'src/app/models/taskDto';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
})
export class ExamComponent implements OnInit {
  testId!: number;
  tasks$!: Observable<ITaskDto[]>;

  createTaskOpened = false;

  constructor(
    private _taskService: TaskService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._route.paramMap
      .pipe(
        tap((res: ParamMap) => {
          this.testId = +res.get('testId')!;
          this.tasks$ = this._taskService.getTasks(this.testId);
        })
      )
      .subscribe();
  }

  createTask() {
    this.createTaskOpened = true;
  }
}
