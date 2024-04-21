import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { EMPTY, Observable, catchError } from 'rxjs';
import { ISubject } from 'src/app/models/subject';
import { ITest } from 'src/app/models/test';
import { ICreateTest } from 'src/app/models/test-create';
import { SubjectService } from 'src/app/services/subject.service';
import { TestService } from 'src/app/services/test.service';
import { ValidatorsStoreService } from 'src/app/validators/validator-store.service';

@Component({
  selector: 'app-add-exam-dialog',
  templateUrl: './add-exam-dialog.component.html',
  styleUrls: ['./add-exam-dialog.component.scss'],
})
export class AddExamDialogComponent implements OnInit {
  //icons
  closeIcon = faTimes;

  form!: FormGroup;

  subjects$!: Observable<ISubject>;

  //public selectedStudents: IUser[] = [];

  constructor(
    //@Inject(MAT_DIALOG_DATA)
    //public data: { classroomName: string; classroomId: number; },
    private dialogRef: MatDialogRef<AddExamDialogComponent>,
    private _subjectService: SubjectService,
    private _testService: TestService,
    private _formBuilder: FormBuilder,
    private validatorsStoreService: ValidatorsStoreService
  ) {}

  ngOnInit(): void {
    this.createSubjectForm();

    this.subjects$ = this._subjectService.getSubjects();
  }

  private createSubjectForm(): void {
    this.form = this._formBuilder.group({
      name: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      description: new FormControl('', {
        validators: [Validators.required],
      }),
      duration: new FormControl('', {
        validators: [
          Validators.required,
          this.validatorsStoreService.durationValidator(),
        ],
      }),
      subjectId: new FormControl('', {
        validators: [Validators.required],
      }),
    });
  }

  submit() {}

  updateSelectedStudents(selectedStudents: any) {
    //this.selectedStudents = selectedStudents as IUser[];
  }

  confirmed() {
    //send invites to selected students
    /*if (this.selectedStudents.length !== 0) {
       let studentIds = this.selectedStudents.map(student => student.id);
       this.classroomService.sendClassroomInvites(this.data.classroomId, studentIds).subscribe( () =>  this.dialogRef.close(true) )
     }
     this.dialogRef.close(true);
     */

    let data = {
      name: this.form.controls['name'].value,
      description: this.form.controls['description'].value,
      duration: this.form.controls['duration'].value + ':00',
      subjectId: this.form.controls['subjectId'].value,
    } as ICreateTest;

    this._testService
      .createTest(data)
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((createdTest: ITest) => this.dialogRef.close(createdTest));
  }
}
