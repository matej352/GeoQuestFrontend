import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ISubject } from 'src/app/models/subject';
import { ISubjectDetailsDto } from 'src/app/models/subject-details';
import { ITest } from 'src/app/models/test';
import { AddExamDialogComponent } from 'src/app/shared/dialogs/add-exam-dialog/add-exam-dialog.component';
import { AddStudentsDialogComponent } from 'src/app/shared/dialogs/add-students-dialog/add-students-dialog.component';
import { AddSubjectDialogComponent } from 'src/app/shared/dialogs/add-subject-dialog/add-subject-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogOpenerService implements OnDestroy {
  public addSubjectDialogResult$: BehaviorSubject<any> =
    new BehaviorSubject<any>({ created: null });
  private addSubjectDialogOpened: boolean = false;

  public addExamDialogResult$: BehaviorSubject<any> = new BehaviorSubject<any>({
    created: null,
  });
  private addExamDialogOpened: boolean = false;

  public addStudentsDialogResult$: BehaviorSubject<any> =
    new BehaviorSubject<any>({ isSent: false });
  private addStudentsDialogOpened: boolean = false;

  subscription!: Subscription;

  constructor(private dialog: MatDialog) {}

  ngOnDestroy(): void {
    console.log('Unsubscribeeeeeeeeee iz dialog servisa');
    this.subscription.unsubscribe();
  }

  openAddSubjectDialog(subject?: ISubjectDetailsDto): void {
    if (!this.addSubjectDialogOpened) {
      this.addSubjectDialogOpened = true;
      const dialogRef = this.dialog.open(AddSubjectDialogComponent, {
        data: { subject },
        maxHeight: '100%',
        id: 'widthResponsivity',
        width: '80%',
        maxWidth: '900px',
        disableClose: true,
        hasBackdrop: true,
      });

      this.subscription = dialogRef
        .afterClosed()
        .subscribe((subject: ISubject) => {
          let isEdit = !!subject;

          if (!isEdit && subject) {
            this.addSubjectDialogResult$.next({ created: true });
          } else if (subject) {
            this.addSubjectDialogResult$.next({ updated: true });
          }
          this.addSubjectDialogOpened = false;
        });
    }
  }

  openAddExamDialog(test?: ITest): void {
    if (!this.addExamDialogOpened) {
      this.addExamDialogOpened = true;
      const dialogRef = this.dialog.open(AddExamDialogComponent, {
        data: { test },
        maxHeight: '100%',
        id: 'widthResponsivity',
        width: '80%',
        maxWidth: '900px',
        disableClose: true,
        hasBackdrop: true,
      });

      this.subscription = dialogRef.afterClosed().subscribe((exam: ITest) => {
        let isEdit = !!test;
        if (!isEdit && exam) {
          this.addExamDialogResult$.next({ created: true });
        } else if (exam) {
          this.addExamDialogResult$.next({ updated: true });
        }
        this.addExamDialogOpened = false;
      });
    }
  }

  openAddStudentsDialog(subjectId: number, subjectName: string): void {
    if (!this.addStudentsDialogOpened) {
      this.addStudentsDialogOpened = true;
      const dialogRef = this.dialog.open(AddStudentsDialogComponent, {
        data: { subjectId, subjectName },
        maxHeight: '100%',
        id: 'widthResponsivity',
        width: '80%',
        maxWidth: '900px',
        disableClose: true,
        hasBackdrop: true,
      });

      dialogRef.afterClosed().subscribe((isSent: boolean) => {
        this.addStudentsDialogOpened = false;
        this.addStudentsDialogResult$.next({ isSent: isSent });
      });
    }
  }
}
