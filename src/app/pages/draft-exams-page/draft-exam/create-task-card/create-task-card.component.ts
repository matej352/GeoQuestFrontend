import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapType } from 'src/app/enums/map-type';
import { TaskType } from 'src/app/enums/task-type';
import { IOptionAnwser } from 'src/app/models/option-anwser';
import { IOptionAnswerDto, ITaskDto } from 'src/app/models/taskDto';
import { TaskService } from 'src/app/services/task.service';
import { SelectionType } from 'src/app/shared/filter-bar/selection-values';
import { MarkPointMapComponent } from 'src/app/shared/maps/mark-point-map/mark-point-map.component';
import { MarkPolygonMapComponent } from 'src/app/shared/maps/mark-polygon-map/mark-polygon-map.component';
import { NonMapMapComponent } from 'src/app/shared/maps/non-map-map/non-map-map.component';
import { SelectPointMapComponent } from 'src/app/shared/maps/select-point-map/select-point-map.component';
import { SelectPolygonMapComponent } from 'src/app/shared/maps/select-polygon-map/select-polygon-map.component';
import { mapType, taskType } from 'src/app/types/types';

@Component({
  selector: 'app-create-task-card',
  templateUrl: './create-task-card.component.html',
  styleUrls: ['./create-task-card.component.scss'],
})
export class CreateTaskCardComponent implements OnInit {
  @ViewChild(SelectPolygonMapComponent)
  selectPolygonMapComponent!: SelectPolygonMapComponent;
  @ViewChild(SelectPointMapComponent)
  selectPointMapComponent!: SelectPointMapComponent;
  @ViewChild(MarkPolygonMapComponent)
  markPolygonMapComponent!: MarkPolygonMapComponent;
  @ViewChild(MarkPointMapComponent)
  markPointMapComponent!: MarkPointMapComponent;
  @ViewChild(NonMapMapComponent) nonMapMapComponent!: NonMapMapComponent;

  @Input()
  testId!: number;

  @Output()
  taskCreatedSuccessfully: EventEmitter<void> = new EventEmitter();

  selection!: SelectionType;
  selection2!: SelectionType;

  drawnItems!: IOptionAnwser[] | null;
  markedPolygon!: string | null;
  markedPoint!: number[] | null;

  selectPointOrPolygonMapHasOneCorrect = false;
  selectPointOrPolygonMapHasAtLeastTwoPoints = false;

  //form
  taskForm!: FormGroup;

  selectedMapTypeOption: mapType = 'normal';
  selectedTaskTypeOption: taskType = 'mark_point';

  constructor(private fb: FormBuilder, private _taskService: TaskService) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      question: ['', { validators: [Validators.required] }],
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

  onSelectMapType() {
    this.selectedMapTypeOption = this.selection.selectedOption as mapType;
    this.selectedTaskTypeOption = this.selection2.selectedOption as taskType;
  }

  onSelectTaskType() {
    this.selectedMapTypeOption = this.selection.selectedOption as mapType;
    this.selectedTaskTypeOption = this.selection2.selectedOption as taskType;

    this.taskForm.reset();
    this.drawnItems = null;
    this.markedPoint = null;
    this.markedPolygon = null;
  }

  drawnItemsChange(items: any) {
    this.drawnItems = items;

    if (this.drawnItems) {
      if (this.drawnItems.length < 2) {
        this.selectPointOrPolygonMapHasAtLeastTwoPoints = false;
      } else {
        this.selectPointOrPolygonMapHasAtLeastTwoPoints = true;
      }

      let correctItems = this.drawnItems.filter(
        (option) => option.properties.isCorrect
      );

      if (correctItems.length != 1) {
        this.selectPointOrPolygonMapHasOneCorrect = false;
      } else {
        this.selectPointOrPolygonMapHasOneCorrect = true;
      }
    } else {
      this.selectPointOrPolygonMapHasOneCorrect = false;
      this.selectPointOrPolygonMapHasAtLeastTwoPoints = false;
    }
  }

  drawnItemChange(markedPolygon: string) {
    this.markedPolygon = markedPolygon;
  }

  markedPointChanged(point: any) {
    this.markedPoint = point;
  }

  submitSelectPolygonOrPoint(polygonOrPoint: string) {
    let optionAnswers = [] as IOptionAnswerDto[];

    this.drawnItems!.forEach((optionAnswer) => {
      optionAnswers.push({
        content: JSON.stringify(optionAnswer.coordinates),
        correct: optionAnswer.properties.isCorrect,
      });
    });

    let taskDto: ITaskDto = {
      testId: this.testId,
      mapCenter:
        polygonOrPoint == 'polygon'
          ? this.selectPolygonMapComponent.getMapCenter()
          : this.selectPointMapComponent.getMapCenter(),
      mapZoomLevel:
        polygonOrPoint == 'polygon'
          ? this.selectPolygonMapComponent.getZoomLevel()
          : this.selectPointMapComponent.getZoomLevel(),
      mapType: this.getMapType(),
      question: this.taskForm.get('question')?.value.editor,
      //answer: this.taskForm.get('answer')?.value,
      type: this.getTaskType(),
      options: {
        singleSelect: true,
        optionAnswers: optionAnswers,
      },
    };

    this._taskService.createTask(taskDto).subscribe((res) => {
      this.taskCreatedSuccessfully.emit();
    });
  }

  submitMarkPoint() {
    let taskDto: ITaskDto = {
      testId: this.testId,
      mapCenter: this.markPointMapComponent.getMapCenter(),
      mapZoomLevel: this.markPointMapComponent.getZoomLevel(),
      mapType: this.getMapType(),
      question: this.taskForm.get('question')?.value.editor,
      answer: this.markedPoint!.toString(),
      type: this.getTaskType(),
    };

    this._taskService.createTask(taskDto).subscribe((res) => {
      this.taskCreatedSuccessfully.emit();
    });
  }

  submitMarkPolygon() {
    let taskDto: ITaskDto = {
      testId: this.testId,
      mapCenter: this.markPolygonMapComponent.getMapCenter(),
      mapZoomLevel: this.markPolygonMapComponent.getZoomLevel(),
      mapType: this.getMapType(),
      question: this.taskForm.get('question')?.value.editor,
      answer: this.markedPolygon!,
      type: this.getTaskType(),
    };

    this._taskService.createTask(taskDto).subscribe((res) => {
      this.taskCreatedSuccessfully.emit();
    });
  }

  submitNonMap() {
    let taskDto: ITaskDto = {
      testId: this.testId,
      mapCenter: this.nonMapMapComponent.getMapCenter(),
      mapZoomLevel: this.nonMapMapComponent.getZoomLevel(),
      mapType: this.getMapType(),
      question: this.taskForm.get('question')?.value.editor,
      //answer: this.markedPoint.toString(),
      nonMapPoint: this.markedPoint!.toString(),
      type: this.getTaskType(),
    };

    this._taskService.createTask(taskDto).subscribe((res) => {
      this.taskCreatedSuccessfully.emit();
    });
  }

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

  getMapType(): MapType {
    switch (this.selectedMapTypeOption) {
      case 'normal':
        return MapType.Normal;

      case 'blind':
        return MapType.Blind;

      case 'satellite':
        return MapType.Satellite;
    }
  }
}
