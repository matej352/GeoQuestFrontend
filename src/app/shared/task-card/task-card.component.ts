import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { EMPTY, catchError } from 'rxjs';
import { TaskType } from 'src/app/enums/task-type';
import { TaskViewMode } from 'src/app/enums/task-view-mode';
import { ITaskDto } from 'src/app/models/taskDto';
import { ITaskInstanceAnswer } from 'src/app/models/taskInstanceAnswerDto';
import { ITaskInstanceDto } from 'src/app/models/taskInstanceDto';
import { TaskInstanceService } from 'src/app/services/task-instance.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit, AfterViewInit {
  TaskType = TaskType;

  @Input()
  task!: ITaskDto | ITaskInstanceDto;

  @Input()
  mode = TaskViewMode.DraftExamPreview;

  @Input()
  index!: number;

  @Input()
  testInstanceId!: number | null;

  constructor(private _taskInstanceService: TaskInstanceService) {}

  ngOnInit(): void {}

  onMarkPointMapStudentAnswer(point: any) {
    if (this.mode === TaskViewMode.Solving) {
      let answer = {
        testInstanceId: this.testInstanceId,
        testTaskInstanceId: this.task.id,
        answer: point.toString(),
      } as ITaskInstanceAnswer;

      this._taskInstanceService
        .saveAnswer(answer)
        .pipe(
          catchError((err) => {
            console.log(err);
            return EMPTY;
          })
        )
        .subscribe();
    }
  }

  onSelectPolygonMapStudentAnswer(optionId: number) {
    if (this.mode === TaskViewMode.Solving) {
      let answer = {
        testInstanceId: this.testInstanceId,
        testTaskInstanceId: this.task.id,
        answer: optionId.toString(),
      } as ITaskInstanceAnswer;

      this._taskInstanceService
        .saveAnswer(answer)
        .pipe(
          catchError((err) => {
            console.log(err);
            return EMPTY;
          })
        )
        .subscribe();
    }
  }

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
            'align-self: center; justify-self: center; height: auto;max-width: 530px;'
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
}
