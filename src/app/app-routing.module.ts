import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestComponent } from './pages/quest/quest.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ExamsPageComponent } from './pages/exams-page/exams-page.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LandingPageGuardService } from './guards/landing-page-guard.service';
import { CurrentUserResolver } from './resolvers/current-user-resolver';
import { SubjectsPageComponent } from './pages/subjects-page/subjects-page.component';
import { ExamComponent } from './pages/exams-page/exam/exam.component';
import { SubjectComponent } from './pages/subjects-page/subject/subject.component';

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
    path: ':role/exams/exam/:testId',
    component: ExamComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: ':role/exams',
    component: ExamsPageComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
