import { Component, Input, OnInit } from '@angular/core';
import { TaskType } from 'src/app/enums/task-type';
import { ITaskDto } from 'src/app/models/taskDto';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {
  TaskType = TaskType;

  @Input()
  task!: ITaskDto;

  constructor() {}

  ngOnInit(): void {}
}
