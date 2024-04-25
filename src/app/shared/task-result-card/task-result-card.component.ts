import { Component, Input, OnInit } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faCross, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TaskType } from 'src/app/enums/task-type';
import { TaskViewMode } from 'src/app/enums/task-view-mode';
import { ITestTaskResult } from 'src/app/models/test-instance-result';

@Component({
  selector: 'app-task-result-card',
  templateUrl: './task-result-card.component.html',
  styleUrls: ['./task-result-card.component.scss'],
})
export class TaskResultCardComponent implements OnInit {
  correctTrue = faCheck;
  correctFalse = faTimesCircle;

  TaskType = TaskType;

  @Input()
  task!: ITestTaskResult;

  @Input()
  index!: number;

  @Input()
  testInstanceId!: number | null;

  @Input()
  mode = TaskViewMode.Result;

  constructor() {}

  ngOnInit(): void {}
}
