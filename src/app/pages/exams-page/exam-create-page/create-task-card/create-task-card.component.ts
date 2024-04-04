import { Component, OnInit } from '@angular/core';
import { SelectionType } from 'src/app/shared/filter-bar/selection-values';

@Component({
  selector: 'app-create-task-card',
  templateUrl: './create-task-card.component.html',
  styleUrls: ['./create-task-card.component.scss'],
})
export class CreateTaskCardComponent implements OnInit {
  selection!: SelectionType;

  constructor() {}

  ngOnInit(): void {
    this.selection = {
      name: 'Status',
      selectedOption: 'any-s',
      otherOptions: [
        { value: 'any-s', viewValue: 'Any' },
        { value: 'active', viewValue: 'Active' },
        { value: 'closed', viewValue: 'Closed' },
      ],
    };
  }

  onSelect() {}
}
