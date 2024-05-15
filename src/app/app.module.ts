import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './shared/map/map.component';
import { NavigationBarComponent } from './shared/navigation-bar/navigation-bar.component';
import { SharedModule } from './modules/shared.module';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SubjectsPageComponent } from './pages/subjects-page/subjects-page.component';
import { FilterBarComponent } from './shared/filter-bar/filter-bar.component';
import { SubjectCardComponent } from './pages/subjects-page/subject-card/subject-card.component';
import { MarkPointMapComponent } from './shared/maps/mark-point-map/mark-point-map.component';
import { TestMapComponent } from './shared/test-map/test-map.component';
import { SelectPolygonMapComponent } from './shared/maps/select-polygon-map/select-polygon-map.component';
import { TooltipComponent } from './shared/tooltip/tooltip.component';
import { TaskCardComponent } from './shared/task-card/task-card.component';
import { AddSubjectDialogComponent } from './shared/dialogs/add-subject-dialog/add-subject-dialog.component';
import { AddExamDialogComponent } from './shared/dialogs/add-exam-dialog/add-exam-dialog.component';
import { DropdownComponent } from './shared/dropdown/dropdown.component';
import { SubjectComponent } from './pages/subjects-page/subject/subject.component';
import { AddStudentsDialogComponent } from './shared/dialogs/add-students-dialog/add-students-dialog.component';
import { StudentsInvitationComponent } from './shared/dialogs/add-students-dialog/students-invitation/students-invitation.component';
import { MyExamsPageComponent } from './pages/my-exams-page/my-exams-page.component';
import { OngoingExamComponent } from './pages/my-exams-page/ongoing-exam/ongoing-exam.component';
import { YesNoDialogComponent } from './shared/dialogs/confirm-leave-ongoing-exam-dialog/confirm-leave-ongoing-exam-dialog.component';
import { PreviousExamsPageComponent } from './pages/previous-exams-page/previous-exams-page.component';
import { PreviousExamComponent } from './pages/previous-exams-page/previous-exam/previous-exam.component';
import { MarkPolygonMapComponent } from './shared/maps/mark-polygon-map/mark-polygon-map.component';
import { NonMapMapComponent } from './shared/maps/non-map-map/non-map-map.component';
import { TaskResultCardComponent } from './shared/task-result-card/task-result-card.component';
import { SelectPointMapComponent } from './shared/maps/select-point-map/select-point-map.component';
import { DraftExamsPageComponent } from './pages/draft-exams-page/draft-exams-page.component';
import { DraftExamComponent } from './pages/draft-exams-page/draft-exam/draft-exam.component';
import { CreateTaskCardComponent } from './pages/draft-exams-page/draft-exam/create-task-card/create-task-card.component';
import { ExamsPageComponent } from './pages/exams-page/exams-page.component';
import { ExamOverviewComponent } from './pages/exams-page/exam-overview/exam-overview.component';
import { ExamInstanceComponent } from './pages/exams-page/exam-overview/exam-instance/exam-instance.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoadingComponent } from './services/loading-service/loading/loading.component';
import { HttpLoadingInterceptor } from './interceptors/HttpLoadingInterceptor';
import { MyExamComponent } from './pages/my-exams-page/my-exam/my-exam.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DraftExamsPageComponent,
    DraftExamComponent,
    NavigationBarComponent,
    LandingPageComponent,
    SubjectsPageComponent,
    FilterBarComponent,
    SubjectCardComponent,
    CreateTaskCardComponent,
    MarkPointMapComponent,
    TestMapComponent,
    SelectPolygonMapComponent,
    TooltipComponent,
    TaskCardComponent,
    AddSubjectDialogComponent,
    AddExamDialogComponent,
    DropdownComponent,
    SubjectComponent,
    AddStudentsDialogComponent,
    StudentsInvitationComponent,
    MyExamsPageComponent,
    OngoingExamComponent,
    YesNoDialogComponent,
    PreviousExamsPageComponent,
    PreviousExamComponent,
    MarkPolygonMapComponent,
    NonMapMapComponent,
    TaskResultCardComponent,
    SelectPointMapComponent,
    ExamsPageComponent,
    ExamOverviewComponent,
    ExamInstanceComponent,
    NotFoundComponent,
    LoadingComponent,
    MyExamComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
