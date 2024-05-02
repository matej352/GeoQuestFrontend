import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

import { Observable, tap } from 'rxjs';

import {
  ITestInstanceForTeacher,
  ITestPublishedDetails,
} from 'src/app/models/test-published-details';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-exam-overview',
  templateUrl: './exam-overview.component.html',
  styleUrls: ['./exam-overview.component.scss'],
})
export class ExamOverviewComponent implements OnInit {
  //icons
  public back = faArrowAltCircleLeft;

  studentsExamSolvingProgress!: number;
  studentsExamSolvingProgressMessage!: string;

  teachersExamGradeProgress!: number;
  teachersExamGradeProgressMessage!: string;

  studentsAvgPointsPercentage!: number;
  studentsAvgPointsMessage!: string;

  constructor(
    private _router: Router,
    private _testService: TestService,
    private _route: ActivatedRoute
  ) {}

  test$!: Observable<ITestPublishedDetails>;
  filteredTests!: ITestInstanceForTeacher[];
  loading = true;

  testInstanceBaseId!: number;

  ngOnInit(): void {
    this._route.paramMap
      .pipe(
        tap((res: ParamMap) => {
          this.testInstanceBaseId = +res.get('testInstanceBaseId')!;
          this.test$ = this._testService
            .getPublishedTestOverview(this.testInstanceBaseId)
            .pipe(
              tap((test) => {
                this.filteredTests = test.testInstances;
                this.prepareDataForProgressBarAndCircle(test);
              })
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

  prepareDataForProgressBarAndCircle(test: ITestPublishedDetails) {
    this.studentsExamSolvingProgress = +(
      (test.finishedInstanceCount / test.instanceCount) *
      100
    ).toFixed(2);

    this.studentsExamSolvingProgressMessage = `Ispit je riješilo ${test.finishedInstanceCount} od ${test.instanceCount} učenika`;

    this.teachersExamGradeProgress = +(
      (test.checkedInstanceCount / test.finishedInstanceCount) *
      100
    ).toFixed(2);

    this.teachersExamGradeProgressMessage = `Ispravljeno je ${test.checkedInstanceCount} od ${test.finishedInstanceCount} riješenih ispita`;

    this.studentsAvgPointsPercentage = +(
      (test.avgPoints / test.totalPoints) *
      100
    ).toFixed(2);

    this.studentsAvgPointsMessage = `Prosječan broj bodova je ${test.avgPoints}`;
  }
  onCloseTest() {}
}
