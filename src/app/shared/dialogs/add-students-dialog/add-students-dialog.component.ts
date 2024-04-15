import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ISubject } from 'src/app/models/subject';
import { IStudentDto } from 'src/app/models/subject-details';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-add-students-dialog',
  templateUrl: './add-students-dialog.component.html',
  styleUrls: ['./add-students-dialog.component.scss'],
})
export class AddStudentsDialogComponent implements OnInit {
  //icons
  closeIcon = faTimes;

  public selectedStudents: IStudentDto[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { subjectId: number; subjectName: string },
    private dialogRef: MatDialogRef<AddStudentsDialogComponent>,
    private _subjectService: SubjectService
  ) {}

  ngOnInit(): void {}

  updateSelectedStudents(selectedStudents: any) {
    this.selectedStudents = selectedStudents as IStudentDto[];
  }

  confirmed() {
    //add selected students into subject
    if (this.selectedStudents.length !== 0) {
      let studentIds = this.selectedStudents.map((student) => student.id);
      this._subjectService
        .addStudents(this.data.subjectId, studentIds)
        .subscribe(() => this.dialogRef.close(true));
    }
    this.dialogRef.close(true);
  }
}
