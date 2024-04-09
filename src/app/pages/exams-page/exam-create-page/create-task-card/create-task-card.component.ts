import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionType } from 'src/app/shared/filter-bar/selection-values';

@Component({
  selector: 'app-create-task-card',
  templateUrl: './create-task-card.component.html',
  styleUrls: ['./create-task-card.component.scss'],
})
export class CreateTaskCardComponent implements OnInit {
  selection!: SelectionType;
  selection2!: SelectionType;

  //form
  taskForm!: FormGroup;

  selectedMapTypeOption: MapType = 'normal';
  selectedTaskTypeOption: TaskType = 'mark_point';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      question: [
        '',
        { validators: [Validators.required, Validators.maxLength(100)] },
      ],
      answer: ['', { validators: [Validators.required] }],
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
    this.selectedMapTypeOption = this.selection.selectedOption as MapType;
    this.selectedTaskTypeOption = this.selection2.selectedOption as TaskType;
  }

  submit() {}
}

export type MapType = 'normal' | 'blind' | 'satellite';
export type TaskType =
  | 'mark_point'
  | 'mark_polygon'
  | 'select_point'
  | 'select_polygon'
  | 'non_map';
