import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestComponent } from './pages/quest/quest.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ExamsPageComponent } from './pages/exams-page/exams-page.component';
import { AuthGuardService } from './guards/auth-guard.service';

const routes: Routes = [
  { path: 'home', component: QuestComponent },
  { path: 'login', component: LoginPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
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
