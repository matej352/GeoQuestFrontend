import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestComponent } from './pages/quest/quest.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DraftExamsPageComponent } from './pages/draft-exams-page/draft-exams-page.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LandingPageGuardService } from './guards/landing-page-guard.service';
import { CurrentUserResolver } from './resolvers/current-user-resolver';
import { SubjectsPageComponent } from './pages/subjects-page/subjects-page.component';
import { SubjectComponent } from './pages/subjects-page/subject/subject.component';
import { MyExamsPageComponent } from './pages/my-exams-page/my-exams-page.component';
import { OngoingExamComponent } from './pages/my-exams-page/ongoing-exam/ongoing-exam.component';
import { LeaveOngoingExamGuard } from './guards/leave-ongoing-exam.guard';
import { PreviousExamsPageComponent } from './pages/previous-exams-page/previous-exams-page.component';
import { PreviousExamComponent } from './pages/previous-exams-page/previous-exam/previous-exam.component';
import { DraftExamComponent } from './pages/draft-exams-page/draft-exam/draft-exam.component';
import { ExamsPageComponent } from './pages/exams-page/exams-page.component';
import { ExamOverviewComponent } from './pages/exams-page/exam-overview/exam-overview.component';
import { ExamInstanceComponent } from './pages/exams-page/exam-overview/exam-instance/exam-instance.component';

const routes: Routes = [
  {
    path: ':role/home',
    component: QuestComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: ':role/subjects/subject/:subjectId',
    component: SubjectComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: ':role/subjects',
    component: SubjectsPageComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'landing',
    component: LandingPageComponent,
    canActivate: [LandingPageGuardService],
  },
  { path: '', pathMatch: 'full', redirectTo: 'landing' },
  {
    path: ':role/draft-exams/exam/:testId',
    component: DraftExamComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: ':role/ongoing-exam/:testInstanceId',
    component: OngoingExamComponent,
    canActivate: [AuthGuardService],
    canDeactivate: [LeaveOngoingExamGuard],
  },
  {
    path: ':role/draft-exams',
    component: DraftExamsPageComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: ':role/exams/exam/:testId/instance/:testInstanceId',
    component: ExamInstanceComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: ':role/exams/exam/:testInstanceBaseId',
    component: ExamOverviewComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: ':role/exams',
    component: ExamsPageComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: ':role/my-exams',
    component: MyExamsPageComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: ':role/previous-exams/exam/:testId',
    component: PreviousExamComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: ':role/previous-exams',
    component: PreviousExamsPageComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
