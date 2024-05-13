import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  faArrowAltCircleLeft,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
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
  //icons
  public back = faArrowAltCircleLeft;
  public editIcon = faEdit;

  subjectId!: number;
  subject!: ISubjectDetailsDto;

  subscription!: Subscription;
  subscription2!: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _subjectService: SubjectService,
    private _dialogOpenerService: DialogOpenerService
  ) {
    this.subscription = this._dialogOpenerService.addStudentsDialogResult$
      .asObservable()
      .subscribe((result) => {
        if (result.isSent) {
          setTimeout(() => {
            this.subjectDetails$ = this._subjectService.getSubject(
              this.subjectId
            );
          }, 100);
        }
      });

    this.subscription2 = this._dialogOpenerService.addSubjectDialogResult$
      .asObservable()
      .subscribe((result) => {
        if (result.updated) {
          this.subjectDetails$ = this._subjectService
            .getSubject(this.subjectId)
            .pipe(tap((subject) => (this.subject = subject)));
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
            .pipe(tap((subject) => (this.subject = subject)));
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  onAddStudents() {
    this._dialogOpenerService.openAddStudentsDialog(
      this.subjectId,
      this.subject.name
    );
  }

  edit() {
    this._dialogOpenerService.openAddSubjectDialog(this.subject);
  }
}
