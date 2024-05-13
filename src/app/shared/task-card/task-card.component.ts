import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { EMPTY, catchError, take, tap } from 'rxjs';
import { MapType } from 'src/app/enums/map-type';
import { TaskType } from 'src/app/enums/task-type';
import { TaskViewMode } from 'src/app/enums/task-view-mode';
import { ITaskDto } from 'src/app/models/taskDto';
import { ITaskInstanceAnswer } from 'src/app/models/taskInstanceAnswerDto';
import { ITaskInstanceDto } from 'src/app/models/taskInstanceDto';
import { TaskInstanceService } from 'src/app/services/task-instance.service';
import { mapType } from 'src/app/types/types';
import { YesNoDialogComponent } from '../dialogs/confirm-leave-ongoing-exam-dialog/confirm-leave-ongoing-exam-dialog.component';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit, AfterViewInit {
  trash = faTrash;

  TaskType = TaskType;

  @Input()
  task!: ITaskDto | ITaskInstanceDto;

  @Input()
  mode = TaskViewMode.DraftExamPreview;

  @Input()
  index!: number;

  @Input()
  testInstanceId!: number | null;

  @Output()
  taskDeleted: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private _taskInstanceService: TaskInstanceService,
    private _taskService: TaskService,
    private dialog: MatDialog
  ) {}

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

  onMarkPolygonMapStudentAnswer(polygon: string) {
    if (this.mode === TaskViewMode.Solving) {
      let answer = {
        testInstanceId: this.testInstanceId,
        testTaskInstanceId: this.task.id,
        answer: polygon,
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

  onSelectPointMapStudentAnswer(optionId: number) {
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

  onNonMapMapStudentAnswer(studentAnswer: string) {
    if (this.mode === TaskViewMode.Solving) {
      let answer = {
        testInstanceId: this.testInstanceId,
        testTaskInstanceId: this.task.id,
        answer: studentAnswer,
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

  deleteTask() {
    const dialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
        title: 'Potvrdite brisanje zadatka',
        description:
          'Zadatak će se trajno izbrisati. Jeste li sigurni da želite obrisati zadaatak?',
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
            // obrisi
            this._taskService
              .deleteTask(this.task.id!)
              .subscribe((res) => this.taskDeleted.emit());
          }
        })
      )
      .subscribe();
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
