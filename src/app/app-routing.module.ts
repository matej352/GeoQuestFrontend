import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestComponent } from './pages/quest/quest.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ExamsPageComponent } from './pages/exams-page/exams-page.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LandingPageGuardService } from './guards/landing-page-guard.service';
import { CurrentUserResolver } from './resolvers/current-user-resolver';

const routes: Routes = [
  {
    path: 'home/:role',
    component: QuestComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'landing',
    component: LandingPageComponent,
    canActivate: [LandingPageGuardService],
  },
  { path: '', pathMatch: 'full', redirectTo: 'landing' },
  {
    path: 'exams',
    component: ExamsPageComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
