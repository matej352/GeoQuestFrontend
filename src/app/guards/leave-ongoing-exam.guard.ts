import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { OngoingExamComponent } from '../pages/my-exams-page/ongoing-exam/ongoing-exam.component';

@Injectable({
  providedIn: 'root',
})
export class LeaveOngoingExamGuard
  implements CanDeactivate<OngoingExamComponent>
{
  canDeactivate(
    component: OngoingExamComponent
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}

export interface DeactivateComponent {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
