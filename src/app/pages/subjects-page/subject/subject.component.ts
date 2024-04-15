import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription, tap } from 'rxjs';
import { ISubject } from 'src/app/models/subject';
import { ISubjectDetailsDto } from 'src/app/models/subject-details';
import { DialogOpenerService } from 'src/app/services/dialog-services/dialog-opener.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss'],
})
export class SubjectComponent implements OnInit, OnDestroy {
  subjectId!: number;
  subjectName!: string;

  subscription!: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _subjectService: SubjectService,
    private _dialogOpenerService: DialogOpenerService
  ) {
    this.subscription = this._dialogOpenerService.addStudentsDialogResult$
      .asObservable()
      .subscribe((result) => {
        if (result.isSent) {
          this.subjectDetails$ = this._subjectService.getSubject(
            this.subjectId
          );
        }
      });
  }

  subjectDetails$!: Observable<ISubjectDetailsDto>;

  ngOnInit(): void {
    this._route.paramMap
      .pipe(
        tap((res: ParamMap) => {
          this.subjectId = +res.get('subjectId')!;
          this.subjectDetails$ = this._subjectService
            .getSubject(this.subjectId)
            .pipe(tap((subject) => (this.subjectName = subject.name)));
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAddStudents() {
    this._dialogOpenerService.openAddStudentsDialog(
      this.subjectId,
      this.subjectName
    );
  }
}
