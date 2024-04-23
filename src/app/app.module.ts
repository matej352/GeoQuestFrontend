import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestComponent } from './pages/quest/quest.component';
import { MapComponent } from './shared/map/map.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ExamsPageComponent } from './pages/exams-page/exams-page.component';
import { CookieService } from 'ngx-cookie-service';
import { NavigationBarComponent } from './shared/navigation-bar/navigation-bar.component';
import { SharedModule } from './modules/shared.module';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SubjectsPageComponent } from './pages/subjects-page/subjects-page.component';
import { FilterBarComponent } from './shared/filter-bar/filter-bar.component';
import { SubjectCardComponent } from './pages/subjects-page/subject-card/subject-card.component';
import { CreateTaskCardComponent } from './pages/exams-page/exam/create-task-card/create-task-card.component';
import { MarkPointMapComponent } from './shared/maps/mark-point-map/mark-point-map.component';
import { TestMapComponent } from './shared/test-map/test-map.component';
import { SelectPolygonMapComponent } from './shared/maps/select-polygon-map/select-polygon-map.component';
import { TooltipComponent } from './shared/tooltip/tooltip.component';
import { ExamComponent } from './pages/exams-page/exam/exam.component';
import { TaskCardComponent } from './shared/task-card/task-card.component';
import { AddSubjectDialogComponent } from './shared/dialogs/add-subject-dialog/add-subject-dialog.component';
import { AddExamDialogComponent } from './shared/dialogs/add-exam-dialog/add-exam-dialog.component';
import { DropdownComponent } from './shared/dropdown/dropdown.component';
import { SubjectComponent } from './pages/subjects-page/subject/subject.component';
import { AddStudentsDialogComponent } from './shared/dialogs/add-students-dialog/add-students-dialog.component';
import { StudentsInvitationComponent } from './shared/dialogs/add-students-dialog/students-invitation/students-invitation.component';
import { MyExamsPageComponent } from './pages/my-exams-page/my-exams-page.component';
import { OngoingExamComponent } from './pages/my-exams-page/ongoing-exam/ongoing-exam.component';
import { ConfirmLeaveOngoingExamDialogComponent } from './shared/dialogs/confirm-leave-ongoing-exam-dialog/confirm-leave-ongoing-exam-dialog.component';
import { PreviousExamsPageComponent } from './pages/previous-exams-page/previous-exams-page.component';
import { PreviousExamComponent } from './pages/previous-exams-page/previous-exam/previous-exam.component';
import { MarkPolygonMapComponent } from './shared/maps/mark-polygon-map/mark-polygon-map.component';
import { NonMapMapComponent } from './shared/maps/non-map-map/non-map-map.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestComponent,
    MapComponent,
    HomeComponent,
    LoginPageComponent,
    ExamsPageComponent,
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
    ExamComponent,
    TaskCardComponent,
    AddSubjectDialogComponent,
    AddExamDialogComponent,
    DropdownComponent,
    SubjectComponent,
    AddStudentsDialogComponent,
    StudentsInvitationComponent,
    MyExamsPageComponent,
    OngoingExamComponent,
    ConfirmLeaveOngoingExamDialogComponent,
    PreviousExamsPageComponent,
    PreviousExamComponent,
    MarkPolygonMapComponent,
    NonMapMapComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
