import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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
export class TaskResultCardComponent implements OnInit, AfterViewInit {
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

  @Output()
  taskGraded: EventEmitter<{ correctness: boolean; wasChecked: boolean }> =
    new EventEmitter<{ correctness: boolean; wasChecked: boolean }>();

  constructor(private _taskInstanceService: TaskInstanceService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.styleContent();
    }, 100);
  }

  //#region [Setup]
  // ovo mogo s ng::deep stilom
  styleContent() {
    let arrayOfQuestions = document.getElementsByClassName('question');

    for (let i = 0; i < arrayOfQuestions.length; i++) {
      let array = arrayOfQuestions[i].querySelectorAll('p, img, ul, ol');
      for (let i = 0; i < array.length; i++) {
        if (array[i].tagName.toUpperCase() == 'P') {
          array[i].setAttribute(
            'style',
            ' display: flex; flex-direction: column;'
          );
        }
        if (array[i].tagName.toUpperCase() == 'IMG') {
          array[i].setAttribute(
            'style',
            'align-self: center; justify-self: center; height: auto;max-width: 480px;'
          );
        }
        if (
          array[i].tagName.toUpperCase() == 'UL' ||
          array[i].tagName.toUpperCase() == 'OL'
        ) {
          array[i].setAttribute('style', 'margin-left: 10%;');
        }
      }
    }
  }

  //#endregion

  gradeTask(correctness: boolean) {
    let grade = {
      id: this.task.id,
      correct: correctness,
    } as ITaskInstanceGradeDto;

    this._taskInstanceService
      .gradeTaskInstance(grade)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      )
      .subscribe((res) => {
        let wasChecked = this.task.checked;

        this.task.checked = true;
        this.task.isCorrect = correctness;
        this.taskGraded.emit({ correctness, wasChecked });
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
