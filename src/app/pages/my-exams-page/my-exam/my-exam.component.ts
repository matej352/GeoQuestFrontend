import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Observable, tap } from 'rxjs';
import { ITest } from 'src/app/models/test';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-my-exam',
  templateUrl: './my-exam.component.html',
  styleUrls: ['./my-exam.component.scss'],
})
export class MyExamComponent implements OnInit {
  //icons
  public back = faArrowAltCircleLeft;

  testInstanceId!: number;

  test$!: Observable<ITest>;

  constructor(
    private _route: ActivatedRoute,
    private _testService: TestService
  ) {}

  ngOnInit(): void {
    this._route.paramMap
      .pipe(
        tap((res: ParamMap) => {
          this.testInstanceId = +res.get('testInstanceId')!;
          this.test$ = this._testService.getTestByTestInstnaceId(
            this.testInstanceId
          );
        })
      )
      .subscribe();
  }
}
