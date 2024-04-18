import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { TaskType } from 'src/app/enums/task-type';
import { ITaskDto } from 'src/app/models/taskDto';
import { ITaskInstanceDto } from 'src/app/models/taskInstanceDto';

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
  mode = 'draft_exam_preview';

  @Input()
  index!: number;

  constructor() {}

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
            'align-self: center; justify-self: center; height: auto;max-width: 510px;'
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
