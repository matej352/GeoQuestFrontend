import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { EMPTY, Observable, catchError, switchMap, tap } from 'rxjs';
import { IAccount } from 'src/app/models/account';
import { ITestInstanceResult } from 'src/app/models/test-instance-result';
import { TestInstanceService } from 'src/app/services/test-instance.service';
import { UserProfileStoreService } from 'src/app/storage/user-profile-store.service';

@Component({
  selector: 'app-previous-exam',
  templateUrl: './previous-exam.component.html',
  styleUrls: ['./previous-exam.component.scss'],
})
export class PreviousExamComponent implements OnInit {
  //icons
  public back = faArrowAltCircleLeft;

  testInstanceId!: number;
  testInstanceResult!: ITestInstanceResult;
  loading = true;

  currentUser$!: Observable<IAccount | null>;
  currentUser!: IAccount | null;

  constructor(
    private _route: ActivatedRoute,
    //private _taskInstanceService: TaskInstanceService,
    private _testInstanceService: TestInstanceService,
    private _userProfileStore: UserProfileStoreService //private _router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this._userProfileStore
      .getAccountData()
      .pipe
      /*tap((user: IAccount | null) => {
        this.currentUser = user;
      }) */
      ();

    this._route.paramMap
      .pipe(
        switchMap((res: ParamMap) => {
          this.testInstanceId = +res.get('testId')!;
          return this._testInstanceService.getTestInstanceResult(
            this.testInstanceId
          );
          /*.pipe(
          tap((testInstance: ITestInstanceDetails) => {
            this.testInstance = testInstance;
            console.log(testInstance);


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
        ); */
        })
      )
      .subscribe((result: ITestInstanceResult) => {
        this.testInstanceResult = result;
        this.loading = false;
        console.log(this.loading);
      });
  }
}
