import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskType } from 'src/app/enums/task-type';
import { IOptionAnwser } from 'src/app/models/option-anwser';
import { IOptionAnswerDto, ITaskDto } from 'src/app/models/taskDto';
import { TaskService } from 'src/app/services/task.service';
import { SelectionType } from 'src/app/shared/filter-bar/selection-values';
import { mapType, taskType } from 'src/app/types/types';

@Component({
  selector: 'app-create-task-card',
  templateUrl: './create-task-card.component.html',
  styleUrls: ['./create-task-card.component.scss'],
})
export class CreateTaskCardComponent implements OnInit {
  @Input()
  testId!: number;

  @Output()
  taskCreatedSuccessfully: EventEmitter<void> = new EventEmitter();

  selection!: SelectionType;
  selection2!: SelectionType;

  drawnItems!: IOptionAnwser[];
  markedPoint!: number[];

  //form
  taskForm!: FormGroup;

  selectedMapTypeOption: mapType = 'normal';
  selectedTaskTypeOption: taskType = 'mark_point';

  constructor(private fb: FormBuilder, private _taskService: TaskService) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      question: ['', { validators: [Validators.required] }],
      answer: [''],
    });

    this.selection = {
      name: 'MapType',
      selectedOption: 'normal',
      otherOptions: [
        { value: 'normal', viewValue: 'Klasična' },
        { value: 'blind', viewValue: 'Slijepa' },
        { value: 'satellite', viewValue: 'Satelitska' },
      ],
    };

    this.selection2 = {
      name: 'TaskType',
      selectedOption: 'mark_point',
      otherOptions: [
        { value: 'mark_point', viewValue: 'Označi točkom na karti' },
        { value: 'mark_polygon', viewValue: 'Označi na karti' },
        { value: 'select_point', viewValue: 'Odaberi točku na karti' },
        { value: 'select_polygon', viewValue: 'Odaberi na karti' },
        { value: 'non_map', viewValue: 'Obično pitanje' },
      ],
    };
  }

  onSelect() {
    console.log(this.selection.selectedOption);
    this.selectedMapTypeOption = this.selection.selectedOption as mapType;
    this.selectedTaskTypeOption = this.selection2.selectedOption as taskType;
  }

  drawnItemsChange(items: any) {
    this.drawnItems = items;
    console.log(this.drawnItems);
  }

  markedPointChanged(point: any) {
    this.markedPoint = point;
    console.log(this.markedPoint);
  }

  submitSelectPolygon() {
    let optionAnswers = [] as IOptionAnswerDto[];

    this.drawnItems.forEach((optionAnswer) => {
      optionAnswers.push({
        content: JSON.stringify(optionAnswer.coordinates),
        correct: optionAnswer.properties.isCorrect,
      });
    });

    let taskDto: ITaskDto = {
      testId: this.testId,
      question: this.taskForm.get('question')?.value.editor,
      answer: this.taskForm.get('answer')?.value,
      type: this.getTaskType(),
      options: {
        singleSelect: true,
        optionAnswers: optionAnswers,
      },
    };

    console.log(taskDto);

    this._taskService.createTask(taskDto).subscribe((res) => {
      console.log(res);
      this.taskCreatedSuccessfully.emit();
    });
  }

  submitMarkPoint() {
    let taskDto: ITaskDto = {
      testId: this.testId,
      question: this.taskForm.get('question')?.value.editor,
      answer: this.markedPoint.toString(),
      type: this.getTaskType(),
    };

    console.log(taskDto);

    this._taskService.createTask(taskDto).subscribe((res) => {
      console.log(res);
      this.taskCreatedSuccessfully.emit();
    });
  }

  submitNonMap() {}

  getTaskType(): TaskType {
    switch (this.selectedTaskTypeOption) {
      case 'mark_point':
        return TaskType.MarkPoint;

      case 'mark_polygon':
        return TaskType.MarkPolygon;

      case 'select_point':
        return TaskType.SelectPoint;

      case 'select_polygon':
        return TaskType.SelectPolygon;

      case 'non_map':
        return TaskType.NonMap;
    }
  }
}
