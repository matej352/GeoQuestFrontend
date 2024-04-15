import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Observable, map, of, startWith } from 'rxjs';
import { IStudentDto } from 'src/app/models/subject-details';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-students-invitation',
  templateUrl: './students-invitation.component.html',
  styleUrls: ['./students-invitation.component.scss'],
})
export class StudentsInvitationComponent implements OnInit {
  //icons
  public removeIcon = faTimes;

  //properties
  public students!: IStudentDto[];
  public selectedStudents: IStudentDto[] = [];

  @Input()
  subjectId!: number;

  @Output()
  onSelectedStudentsChange: EventEmitter<IStudentDto[]> = new EventEmitter();

  studentsInputControl = new FormControl('');
  filteredStudents$: Observable<IStudentDto[]> = of([]);

  constructor(private _accountService: AccountService) {}

  ngOnInit(): void {
    this.getStudents();
  }

  //#region [Api calls]

  getStudents(): void {
    this._accountService.getStudentAccounts(this.subjectId).subscribe((s) => {
      this.students = s;
      this.filteredStudents$ = of(s);
      this.setupAutocomplete();
    });
  }

  //#endregion

  setupAutocomplete() {
    this.filteredStudents$ = this.studentsInputControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '')),
      map((value) => {
        this.checkForNameMatch();
        return value;
      })
    );
  }

  //#endregion

  //#region [Actions]

  onRemove(studentForRemoval: IStudentDto) {
    var filteredArray = this.selectedStudents.filter(
      (s) => s.id !== studentForRemoval.id
    );
    this.selectedStudents = filteredArray;
    this.onSelectedStudentsChange.emit(this.selectedStudents);
    this.students.push(studentForRemoval);
  }

  onAddStudent() {
    let name: string = this.studentsInputControl.value!;
    let student = this.students.find(
      (s) => s.firstName + ' ' + s.lastName === name
    );
    if (student) {
      this.selectedStudents.push(student);
      this.onSelectedStudentsChange.emit(this.selectedStudents);
      this.removeSelectedStudentFromDropdown(student);
      this.studentsInputControl.setValue('');
      this.disableAddButton();
    }
  }

  //#endregion

  //#region [Helpers]

  private _filter(value: string): IStudentDto[] {
    const filterValue = value.toLowerCase();
    let helperArry = this.students.filter((s) => {
      if (
        filterValue == '' ||
        s.firstName.toLocaleLowerCase().includes(filterValue) ||
        s.lastName.toLocaleLowerCase().includes(filterValue)
      ) {
        return true;
      }
      return false;
    });

    return helperArry;
  }

  enableAddButton() {
    let btn = document.getElementsByClassName('add')[0];
    btn.classList.remove('accessibility');
  }

  disableAddButton() {
    let btn = document.getElementsByClassName('add')[0];
    btn.classList.add('accessibility');
  }

  removeSelectedStudentFromDropdown(student: IStudentDto) {
    var filteredArray = this.students.filter((s) => s.id !== student.id);
    this.students = filteredArray;
  }

  checkForNameMatch() {
    if (
      this.students.find(
        (s) =>
          s.firstName + ' ' + s.lastName === this.studentsInputControl.value
      )
    ) {
      this.enableAddButton();
    } else {
      this.disableAddButton();
    }
  }
}
