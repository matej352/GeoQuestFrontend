import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, tap } from 'rxjs';
import { DeactivateComponent } from 'src/app/guards/leave-ongoing-exam.guard';
import { DialogOpenerService } from 'src/app/services/dialog-services/dialog-opener.service';
import { ConfirmLeaveOngoingExamDialogComponent } from 'src/app/shared/dialogs/confirm-leave-ongoing-exam-dialog/confirm-leave-ongoing-exam-dialog.component';

@Component({
  selector: 'app-ongoing-exam',
  templateUrl: './ongoing-exam.component.html',
  styleUrls: ['./ongoing-exam.component.scss'],
})
export class OngoingExamComponent
  implements OnInit, OnDestroy, DeactivateComponent
{
  remainingTime: number = 15 * 60; // 15 minutes in seconds
  formattedTime: string = '';

  timerInterval: any;
  testInProgress: boolean = true;

  dialogOpened = false;

  constructor(
    private _dialog: DialogOpenerService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.formatTime();
      } else {
        this.submitTest();
      }
    }, 1000);
  }

  formatTime(): void {
    const minutes: number = Math.floor(this.remainingTime / 60);
    const seconds: number = this.remainingTime % 60;
    this.formattedTime = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  canDeactivate(): Observable<boolean> {
    if (!this.dialogOpened) {
      this.dialogOpened = true;
      const dialogRef = this.dialog.open(
        ConfirmLeaveOngoingExamDialogComponent,
        {
          width: '250px',
        }
      );

      return dialogRef.afterClosed().pipe(
        tap((trueOrFlase: boolean) => {
          if (trueOrFlase == false) {
            this.dialogOpened = false;
          }
        })
      );
    } else {
      return of(true);
    }
  }

  // Method to handle test submission
  submitTest(): void {
    this.testInProgress = false;
    // Logic to submit the test
  }
}
