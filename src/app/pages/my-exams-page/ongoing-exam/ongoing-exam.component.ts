import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  NavigationEnd,
  ParamMap,
  Router,
} from '@angular/router';
import {
  EMPTY,
  Observable,
  catchError,
  filter,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { TaskViewMode } from 'src/app/enums/task-view-mode';
import { DeactivateComponent } from 'src/app/guards/leave-ongoing-exam.guard';
import { IAccount } from 'src/app/models/account';
import { ITaskInstanceDto } from 'src/app/models/taskInstanceDto';
import { ITestInstanceDetails } from 'src/app/models/test-instance-details';
import {
  ITestInstanceFinish,
  IUpdateElapsedTime,
} from 'src/app/models/test-instance-finish';
import { DialogOpenerService } from 'src/app/services/dialog-services/dialog-opener.service';
import { TaskInstanceService } from 'src/app/services/task-instance.service';
import { TestInstanceService } from 'src/app/services/test-instance.service';
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
  remainingTime!: number;
  formattedTime: string = '';

  timerInterval: any;
  testInProgress: boolean = true;

  testInstanceId!: number;

  dialogOpened = false;
  testAlreadyFinished = false;
  loading = true;

  currentUser$!: Observable<IAccount | null>;
  currentUser!: IAccount | null;

  tasks!: ITaskInstanceDto[];
  testInstance!: ITestInstanceDetails;

  taskViewMode = TaskViewMode;

  constructor(
    private _dialog: DialogOpenerService,
    private dialog: MatDialog,
    private _route: ActivatedRoute,
    private _taskInstanceService: TaskInstanceService,
    private _testInstanceService: TestInstanceService,
    private _userProfileStore: UserProfileStoreService,
    private _router: Router
  ) {
    this._route.paramMap
      .pipe(
        switchMap((res: ParamMap) => {
          this.testInstanceId = +res.get('testInstanceId')!;
          return this._testInstanceService
            .getTestInstance(this.testInstanceId)
            .pipe(
              tap((testInstance: ITestInstanceDetails) => {
                this.testInstance = testInstance;
                console.log(testInstance);

                if (!testInstance.started) {
                  this.startTestInstance();
                  this.remainingTime = this.getSecondsFromDuration(
                    testInstance.duration
                  );
                } else {
                  this.remainingTime =
                    this.getSecondsFromDuration(testInstance.duration) -
                    this.getSecondsFromDuration(testInstance.elapsedTime);
                }

                this.startTimer();
              }),
              switchMap((testInstance: ITestInstanceDetails) => {
                return this._taskInstanceService.getTaskInstances(
                  testInstance.id
                );
              }),
              catchError((err) => {
                console.log(err);
                // Handle error here, e.g., open a snackbar and reroute
                this.testAlreadyFinished = true;
                this._router.navigateByUrl('/student/my-exams');
                return EMPTY; // Return an empty observable to continue the stream
              })
            );
        })
      )
      .subscribe((tasks: any) => {
        this.tasks = tasks;
        this.loading = false;
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    //that means exam is not properly submitted (either refresh is clicked or browser back and 'yes' in dialog)
    if (this.testInProgress) {
      let updateElapsedTimeData = {
        id: this.testInstanceId,
        elapsedTime: this.formatTimeSpanDuration(
          this.getSecondsFromDuration(this.testInstance.duration) -
            this.remainingTime
        ), //proteklo vrijeme = test duration - remaining time
      } as IUpdateElapsedTime;

      this._testInstanceService
        .updateElapsedTime(updateElapsedTimeData)

        .subscribe();
    }
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

  startTestInstance() {
    this._testInstanceService
      .startTestInstance(this.testInstanceId)
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  canDeactivate(): Observable<boolean> {
    if (!this.dialogOpened && !this.testAlreadyFinished) {
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
          } else {
            let finishData = {
              id: this.testInstanceId,
              elapsedTime: this.formatTimeSpanDuration(
                this.getSecondsFromDuration(this.testInstance.duration) -
                  this.remainingTime
              ), //proteklo vrijeme = test duration - remaining time
            } as ITestInstanceFinish;

            this._testInstanceService
              .finishTestInstance(finishData)
              .subscribe();
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

  getSecondsFromDuration(durationString: string) {
    const [hours, minutes, seconds] = durationString.split(':');
    const totalSeconds =
      parseInt(hours, 10) * 3600 +
      parseInt(minutes, 10) * 60 +
      parseInt(seconds, 10);
    return totalSeconds;
  }

  formatTimeSpanDuration(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
}
