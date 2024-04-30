import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { ITestInstanceDetails } from 'src/app/models/test-instance-details';
import { ITestPublishedDetails } from 'src/app/models/test-published-details';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-exam-overview',
  templateUrl: './exam-overview.component.html',
  styleUrls: ['./exam-overview.component.scss'],
})
export class ExamOverviewComponent implements OnInit {
  constructor(
    private _router: Router,
    private _testService: TestService,
    private _route: ActivatedRoute
  ) {}

  test$!: Observable<ITestPublishedDetails>;
  loading = true;

  testInstanceBaseId!: number;

  ngOnInit(): void {
    this._route.paramMap
      .pipe(
        tap((res: ParamMap) => {
          this.testInstanceBaseId = +res.get('testInstanceBaseId')!;
          this.test$ = this._testService.getPublishedTestOverview(
            this.testInstanceBaseId
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
      .subscribe();
  }
  onCloseTest() {}
}
