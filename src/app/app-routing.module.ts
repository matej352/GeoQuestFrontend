import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestComponent } from './pages/quest/quest.component';

const routes: Routes = [
  { path: 'home', component: QuestComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
