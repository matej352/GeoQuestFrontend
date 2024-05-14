import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

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
    this.currentUser$ = this._userProfileStore.getAccountData();

    this._route.paramMap
      .pipe(
        switchMap((res: ParamMap) => {
          this.testInstanceId = +res.get('testInstanceId')!;
          return this._testInstanceService.getTestInstanceResult(
            this.testInstanceId
          );
        })
      )
      .subscribe((result: ITestInstanceResult) => {
        this.testInstance = result;
        this.loading = false;
      });
  }

  navigateBack() {
    this._router.navigate(['../../'], { relativeTo: this._route });
  }

  onTaskGraded(obj: { correctness: boolean; wasChecked: boolean }) {
    if (obj.correctness) {
      this.testInstance.studentTotalPoints += 1;
    } else if (!obj.correctness && obj.wasChecked) {
      this.testInstance.studentTotalPoints -= 1;
    }

    if (!this.testInstance.testTasks.find((task) => task.checked === false)) {
      this.testInstance.allChecked = true;
    }

    this.recalculateSuccessPercentage();
  }

  recalculateSuccessPercentage() {
    let correctAndChecked = this.testInstance.testTasks.filter(
      (task) => task.checked && task.isCorrect
    ).length;

    let all = this.testInstance.testTasks.length;

    this.testInstance.successPercentage = (correctAndChecked / all) * 100;
  }
}
