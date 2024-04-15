import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ISubject } from 'src/app/models/subject';
import { AddSubjectDialogComponent } from 'src/app/shared/dialogs/add-subject-dialog/add-subject-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogOpenerService implements OnDestroy {
  public addSubjectDialogResult$: BehaviorSubject<any> =
    new BehaviorSubject<any>({ created: null });
  private addSubjectDialogOpened: boolean = false;

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
}
