import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of, switchMap, tap } from 'rxjs';
import { TaskViewMode } from 'src/app/enums/task-view-mode';
import { DeactivateComponent } from 'src/app/guards/leave-ongoing-exam.guard';
import { IAccount } from 'src/app/models/account';
import { ITaskInstanceDto } from 'src/app/models/taskInstanceDto';
import { DialogOpenerService } from 'src/app/services/dialog-services/dialog-opener.service';
import { TaskInstanceService } from 'src/app/services/task-instance.service';
import { ConfirmLeaveOngoingExamDialogComponent } from 'src/app/shared/dialogs/confirm-leave-ongoing-exam-dialog/confirm-leave-ongoing-exam-dialog.component';
import { UserProfileStoreService } from 'src/app/storage/user-profile-store.service';

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

  testInstanceId!: number;

  dialogOpened = false;

  currentUser$!: Observable<IAccount | null>;
  currentUser!: IAccount | null;

  tasks$!: Observable<ITaskInstanceDto[]>;

  taskViewMode = TaskViewMode;

  constructor(
    private _dialog: DialogOpenerService,
    private dialog: MatDialog,
    private _route: ActivatedRoute,
    private _taskInstanceService: TaskInstanceService,
    private _userProfileStore: UserProfileStoreService
  ) {
    this._route.paramMap
      .pipe(
        tap((res: ParamMap) => {
          this.testInstanceId = +res.get('testInstanceId')!;
          this.tasks$ = this._taskInstanceService.getTaskInstances(
            this.testInstanceId
          );

          /*this.subjectDetails$ = this._subjectService
            .getSubject(this.subjectId)
            .pipe(tap((subject) => (this.subjectName = subject.name)));*/
        })
        /*switchMap((res) => {
          this.currentUser$ = this._userProfileStore.getAccountData().pipe(
            tap((user: IAccount | null) => {
              this.currentUser = user;
              this.navigationItems = this.getNavigtionItems();
            })
          );
        }) */
      )
      .subscribe();
  }

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
