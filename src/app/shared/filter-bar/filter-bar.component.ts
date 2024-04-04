import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectionType } from './selection-values';
import { EnumToArrayPipe } from 'src/app/pipes/enum-to-array.pipe';
import { FieldOfStudy } from 'src/app/enums/field-of-study';
import { Language } from 'src/app/enums/course-language';
import { Grade } from 'src/app/enums/classroom-grade';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent implements OnInit {
  @Input()
  type!: string;

  @Output()
  optionClick = new EventEmitter();

  selectArray: SelectionType[] = [];

  constructor() {}

  ngOnInit(): void {
    this.setup();
    this.onSelect();
  }

  //#region [Setup]

  setup() {
    switch (this.type) {
      case 'parent-role-classroom-statistics':
        this.setupForParentOrStudentRoleClassroomStatistics();
        break;
      case 'student-role-classroom-statistics':
        this.setupForParentOrStudentRoleClassroomStatistics();
        break;
      case 'teacher-role-classroom':
        this.setupForTeacherRoleClassroom();
        break;
      case 'teacher-role-classroom-students':
        this.setupForTeacherRoleClassroomStudents();
        break;
      default:
        throw new Error('Filtering error');
    }
  }

  setupForParentOrStudentRoleClassroomStatistics() {
    this.selectArray.push({
      name: 'Status',
      selectedOption: 'any-s',
      otherOptions: [
        { value: 'any-s', viewValue: 'Any' },
        { value: 'active', viewValue: 'Active' },
        { value: 'closed', viewValue: 'Closed' },
      ],
    });

    this.selectArray.push({
      name: 'Progress',
      selectedOption: 'any-p',
      otherOptions: [
        { value: 'any-p', viewValue: 'Any' },
        { value: 'Completed', viewValue: 'Completed' },
        { value: 'In_Progress', viewValue: 'In Progress' },
        { value: 'Launched', viewValue: 'Launched' },
        { value: 'None', viewValue: 'None' },
      ],
    });
  }

  setupForTeacherRoleClassroom() {
    const pipe = new EnumToArrayPipe();

    this.selectArray.push({
      name: 'Status',
      selectedOption: 'any-s',
      otherOptions: [
        { value: 'any-s', viewValue: 'Any' },
        { value: 'active', viewValue: 'Active' },
        { value: 'closed', viewValue: 'Closed' },
      ],
    });

    let fieldsOfStudyType = {
      name: 'Field of study',
      selectedOption: 'any-f',
      otherOptions: [{ value: 'any-f', viewValue: 'Any' }],
    };
    const fieldOfStudyEnumArray = pipe.transform(FieldOfStudy, true);
    fieldOfStudyEnumArray.forEach((_) =>
      fieldsOfStudyType.otherOptions.push({ value: _[1], viewValue: _[0] })
    );
    this.selectArray.push(fieldsOfStudyType);

    let languageType = {
      name: 'Language',
      selectedOption: 'any-l',
      otherOptions: [{ value: 'any-l', viewValue: 'Any' }],
    };
    const languageEnumArray = pipe.transform(Language, true);
    languageEnumArray.forEach((_) =>
      languageType.otherOptions.push({ value: _[1], viewValue: _[0] })
    );
    this.selectArray.push(languageType);

    let gradeType = {
      name: 'Grade',
      selectedOption: 'any-g',
      otherOptions: [{ value: 'any-g', viewValue: 'Any' }],
    };
    const gradeEnumArray = pipe.transform(Grade, true);
    gradeEnumArray.forEach((_) =>
      gradeType.otherOptions.push({ value: _[1], viewValue: _[0] })
    );
    this.selectArray.push(gradeType);
  }

  setupForTeacherRoleClassroomStudents() {
    this.selectArray.push({
      name: 'Invitation status',
      selectedOption: 'any-is',
      otherOptions: [
        { value: 'any-is', viewValue: 'Any' },
        { value: 'accepted', viewValue: 'Accepted' },
        { value: 'rejected', viewValue: 'Rejected' },
        { value: 'pending', viewValue: 'Pending' },
      ],
    });

    this.selectArray.push({
      name: 'Progress',
      selectedOption: 'any-p',
      otherOptions: [
        { value: 'any-p', viewValue: 'Any' },
        { value: 'Completed', viewValue: 'Completed' },
        { value: 'In_Progress', viewValue: 'In Progress' },
        { value: 'Launched', viewValue: 'Launched' },
        { value: 'None', viewValue: 'None' },
      ],
    });
  }

  //#endregion

  //#region [Actions]

  onSelect() {
    switch (this.type) {
      case 'parent-role-classroom-statistics':
        this.filterForParentOrStudentRoleClassroomStatistics();
        break;
      case 'student-role-classroom-statistics':
        this.filterForParentOrStudentRoleClassroomStatistics();
        break;
      case 'teacher-role-classroom':
        this.filterForTeacherRoleClassroom();
        break;
      case 'teacher-role-classroom-students':
        this.filterForTeacherRoleClassroomStudents();
        break;
      default:
        throw new Error('Filtering error');
    }
  }

  filterForParentOrStudentRoleClassroomStatistics() {
    let obj = {
      statusFilter: this.selectArray[0].selectedOption,
      progressFilter: this.selectArray[1].selectedOption,
    };
    this.optionClick.emit(obj);
  }

  filterForTeacherRoleClassroom() {
    let obj = {
      statusFilter: this.selectArray[0].selectedOption,
      fieldOfStudyFilter: this.selectArray[1].selectedOption,
      languageFilter: this.selectArray[2].selectedOption,
      gradeFilter: this.selectArray[3].selectedOption,
    };
    this.optionClick.emit(obj);
  }

  filterForTeacherRoleClassroomStudents() {
    let obj = {
      invitationStatusFilter: this.selectArray[0].selectedOption,
      progressFilter: this.selectArray[1].selectedOption,
    };
    this.optionClick.emit(obj);
  }

  //#endregion
}
