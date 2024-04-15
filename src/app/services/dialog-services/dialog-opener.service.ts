import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ISubject } from 'src/app/models/subject';
import { ITest } from 'src/app/models/test';
import { AddExamDialogComponent } from 'src/app/shared/dialogs/add-exam-dialog/add-exam-dialog.component';
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

  subscription!: Subscription;

  constructor(private dialog: MatDialog) {}

  ngOnDestroy(): void {
    console.log('Unsubscribeeeeeeeeee iz dialog servisa');
    this.subscription.unsubscribe();
  }

  openAddSubjectDialog(): void {
    if (!this.addSubjectDialogOpened) {
      this.addSubjectDialogOpened = true;
      const dialogRef = this.dialog.open(AddSubjectDialogComponent, {
        maxHeight: '100%',
        id: 'widthResponsivity',
        width: '80%',
        maxWidth: '900px',
        disableClose: true,
        hasBackdrop: true,
      });

      this.subscription = dialogRef
        .afterClosed()
        .subscribe((createdSubject: ISubject) => {
          if (createdSubject) {
            this.addSubjectDialogResult$.next({ created: true });
          }
          this.addSubjectDialogOpened = false;
        });
    }
  }

  openAddExamDialog(): void {
    if (!this.addExamDialogOpened) {
      this.addExamDialogOpened = true;
      const dialogRef = this.dialog.open(AddExamDialogComponent, {
        maxHeight: '100%',
        id: 'widthResponsivity',
        width: '80%',
        maxWidth: '900px',
        disableClose: true,
        hasBackdrop: true,
      });

      this.subscription = dialogRef
        .afterClosed()
        .subscribe((createdExam: ITest) => {
          if (createdExam) {
            this.addExamDialogResult$.next({ created: true });
          }
          this.addExamDialogOpened = false;
        });
    }
  }
}
