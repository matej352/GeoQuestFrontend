import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ISubject } from 'src/app/models/subject';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-subjects-page',
  templateUrl: './subjects-page.component.html',
  styleUrls: ['./subjects-page.component.scss'],
})
export class SubjectsPageComponent implements OnInit {
  //private teacher!: IUser;

  subjects$!: Observable<ISubject[]>;
  //allClassrooms$!: Observable<IClassroom[]>;

  constructor(private subjectService: SubjectService) {}

  ngOnInit(): void {
    //this.allClassrooms$ = this.getClassrooms(this.teacher.id);
    //this.classrooms$ = this.allClassrooms$;
    this.subjects$ = this.subjectService.getSubjects();
  }

  /*getClassrooms(id: number): Observable<IClassroom[]> {
    return this.classroomService.getClassrooms(id);
  }

  //#region [Actions]

  onFilter(filterOptions: any) {
    this.classrooms$ = this.allClassrooms$.pipe(
      map((classrooms) =>
        classrooms.filter((c) => {
          if (
            filterOptions.statusFilter == 'any-s' &&
            filterOptions.fieldOfStudyFilter == 'any-f' &&
            filterOptions.languageFilter == 'any-l' &&
            filterOptions.gradeFilter == 'any-g'
          ) {
            //console.log('Samo vrati sve')
            return true;
          } else {
            let match: boolean = true;
            for (const property in filterOptions) {
              if (!(filterOptions[property] as string).startsWith('any')) {
                //console.log('Filter prema ' + property)
                let classroomProperty =
                  this.generateClassroomPorperty(property);
                let classroomPropertyValue = (c as any)[classroomProperty];

                //for numeric enum Grade
                if (classroomProperty === 'grade') {
                  classroomPropertyValue = Grade[classroomPropertyValue];
                }

                if (
                  filterOptions[property].replaceAll('_', ' ') !==
                  classroomPropertyValue
                ) {
                  match = false;
                }
              }
            }
            return match;
          }
        })
      )
    );
  }

  generateClassroomPorperty(filterProperty: string) {
    switch (filterProperty) {
      case 'statusFilter':
        return 'status';

      case 'fieldOfStudyFilter':
        return 'fieldOfStudy';

      case 'languageFilter':
        return 'language';

      case 'gradeFilter':
        return 'grade';

      default:
        return 'Error';
    }
  }

  //#endregion

  */
}
