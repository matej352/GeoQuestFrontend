import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { EMPTY, catchError } from 'rxjs';
import { ISubject } from 'src/app/models/subject';
import { ISubjectDetailsDto } from 'src/app/models/subject-details';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-add-subject-dialog',
  templateUrl: './add-subject-dialog.component.html',
  styleUrls: ['./add-subject-dialog.component.scss'],
})
export class AddSubjectDialogComponent implements OnInit {
  //icons
  closeIcon = faTimes;

  form!: FormGroup;

  isEdit = false;

  //public selectedStudents: IUser[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { subject: ISubjectDetailsDto },
    private dialogRef: MatDialogRef<AddSubjectDialogComponent>,
    private _subjectService: SubjectService,
    private _formBuilder: FormBuilder
  ) {
    if (this.data?.subject) {
      this.isEdit = true;
    }
  }

  ngOnInit(): void {
    this.createSubjectForm();
  }

  private createSubjectForm(): void {
    this.form = this._formBuilder.group({
      name: new FormControl(this.isEdit ? this.data.subject.name : '', {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      description: new FormControl(
        this.isEdit ? this.data.subject.description : ''
      ),
    });
  }

  submit() {}

  updateSelectedStudents(selectedStudents: any) {
    //this.selectedStudents = selectedStudents as IUser[];
  }

  confirmed() {
    let data = {
      id: this.isEdit ? this.data.subject.id : undefined,
      name: this.form.controls['name'].value,
      description: this.form.controls['description'].value,
    } as ISubject;

    if (this.isEdit) {
      this._subjectService
        .updateSubject(data)
        .pipe(
          catchError((err) => {
            return EMPTY;
          })
        )
        .subscribe((updatedSubject: ISubject) =>
          this.dialogRef.close(updatedSubject)
        );
    } else {
      this._subjectService
        .createSubject(data)
        .pipe(
          catchError((err) => {
            return EMPTY;
          })
        )
        .subscribe((createdSubject: ISubject) =>
          this.dialogRef.close(createdSubject)
        );
    }
  }
}
