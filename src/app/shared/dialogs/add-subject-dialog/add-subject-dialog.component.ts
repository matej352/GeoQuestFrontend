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

  //public selectedStudents: IUser[] = [];

  constructor(
    //@Inject(MAT_DIALOG_DATA)
    //public data: { classroomName: string; classroomId: number; },
    private dialogRef: MatDialogRef<AddSubjectDialogComponent>,
    private _subjectService: SubjectService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createSubjectForm();
  }

  private createSubjectForm(): void {
    this.form = this._formBuilder.group({
      name: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      description: new FormControl('', {
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
    } as ISubject;

    this._subjectService
      .createSubject(data)
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((createdSubject: ISubject) =>
        this.dialogRef.close(createdSubject)
      );
  }
}
