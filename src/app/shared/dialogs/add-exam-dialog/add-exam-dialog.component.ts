import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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

  isEdit = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { test: ITest },
    private dialogRef: MatDialogRef<AddExamDialogComponent>,
    private _subjectService: SubjectService,
    private _testService: TestService,
    private _formBuilder: FormBuilder,
    private validatorsStoreService: ValidatorsStoreService
  ) {
    if (this.data?.test) {
      this.isEdit = true;
    }
  }

  ngOnInit(): void {
    this.createSubjectForm();

    this.subjects$ = this._subjectService.getSubjects();
  }

  private createSubjectForm(): void {
    this.form = this._formBuilder.group({
      name: new FormControl(this.isEdit ? this.data.test.name : '', {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      description: new FormControl(
        this.isEdit ? this.data.test.description : ''
      ),
      duration: new FormControl(
        this.isEdit
          ? this.data.test.duration.split(':').slice(0, 2).join(':')
          : '',
        {
          validators: [
            Validators.required,
            this.validatorsStoreService.durationValidator(),
          ],
        }
      ),
      subjectId: new FormControl(this.isEdit ? this.data.test.subjectId : '', {
        validators: [Validators.required],
      }),
    });
  }

  submit() {}

  updateSelectedStudents(selectedStudents: any) {
    //this.selectedStudents = selectedStudents as IUser[];
  }

  confirmed() {
    let data = {
      id: this.isEdit ? this.data.test.id : undefined,
      name: this.form.controls['name'].value,
      description: this.form.controls['description'].value,
      duration: this.form.controls['duration'].value + ':00',
      subjectId: this.form.controls['subjectId'].value,
    } as ICreateTest;

    if (this.isEdit) {
      this._testService
        .updateTest(data)
        .pipe(
          catchError((err) => {
            return EMPTY;
          })
        )
        .subscribe((updatedTest: ITest) => this.dialogRef.close(updatedTest));
    } else {
      this._testService
        .createTest(data)
        .pipe(
          catchError((err) => {
            return EMPTY;
          })
        )
        .subscribe((createdTest: ITest) => this.dialogRef.close(createdTest));
    }
  }
}
