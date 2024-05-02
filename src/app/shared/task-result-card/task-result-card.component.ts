import { Component, Input, OnInit } from '@angular/core';
import { faClock, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faCross, faTimes } from '@fortawesome/free-solid-svg-icons';
import { EMPTY, catchError } from 'rxjs';
import { MapType } from 'src/app/enums/map-type';
import { TaskType } from 'src/app/enums/task-type';
import { TaskViewMode } from 'src/app/enums/task-view-mode';
import { IAccount } from 'src/app/models/account';
import { ITaskInstanceGradeDto } from 'src/app/models/taskInstanceGradeDto';
import { ITestTaskResult } from 'src/app/models/test-instance-result';
import { TaskInstanceService } from 'src/app/services/task-instance.service';
import { mapType } from 'src/app/types/types';

@Component({
  selector: 'app-task-result-card',
  templateUrl: './task-result-card.component.html',
  styleUrls: ['./task-result-card.component.scss'],
})
export class TaskResultCardComponent implements OnInit {
  correctTrue = faCheck;
  correctFalse = faTimesCircle;
  correctPending = faClock;

  TaskType = TaskType;

  @Input()
  task!: ITestTaskResult;

  @Input()
  index!: number;

  @Input()
  testInstanceId!: number | null;

  @Input()
  mode = TaskViewMode.Result;

  @Input()
  currentUser!: IAccount | null;

  constructor(private _taskInstanceService: TaskInstanceService) {}

  ngOnInit(): void {}

  gradeTask(correctness: boolean) {
    let grade = {
      id: this.task.id,
      correct: correctness,
    } as ITaskInstanceGradeDto;

    this._taskInstanceService
      .gradeTaskInstance(grade)
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.task.checked = true;
        this.task.isCorrect = correctness;
      });
  }

  getMapType(mapType: MapType): mapType {
    switch (mapType) {
      case MapType.Normal:
        return 'normal';

      case MapType.Blind:
        return 'blind';

      case MapType.Satellite:
        return 'satellite';

      default:
        return 'normal';
    }
  }
}
