import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { Observable, switchMap } from 'rxjs';
import { IAccount } from 'src/app/models/account';
import { ITestInstanceResult } from 'src/app/models/test-instance-result';
import { TestInstanceService } from 'src/app/services/test-instance.service';
import { UserProfileStoreService } from 'src/app/storage/user-profile-store.service';

@Component({
  selector: 'app-exam-instance',
  templateUrl: './exam-instance.component.html',
  styleUrls: ['./exam-instance.component.scss'],
})
export class ExamInstanceComponent implements OnInit {
  //icons
  public back = faArrowAltCircleLeft;

  currentUser$!: Observable<IAccount | null>;
  currentUser!: IAccount | null;

  testInstanceId!: number;
  testInstance!: ITestInstanceResult;
  loading = true;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _testInstanceService: TestInstanceService,
    private _userProfileStore: UserProfileStoreService
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
          this.testInstanceId = +res.get('testInstanceId')!;
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
        this.testInstance = result;
        this.loading = false;
        console.log(this.loading);
      });
  }

  navigateBack() {
    this._router.navigate(['../../'], { relativeTo: this._route });
  }
}
