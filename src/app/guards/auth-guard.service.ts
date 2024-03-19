import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserProfileStoreService } from '../storage/user-profile-store.service';
import { Observable, delay, map, of, take } from 'rxjs';
import { IAccount } from '../models/account';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private _userProfileStore: UserProfileStoreService
  ) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkIfTeacherLoggedIn();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkIfTeacherLoggedIn();
  }

  checkIfTeacherLoggedIn(): boolean {
    let account = this._userProfileStore.getAccountData();
    if (account !== null && account.role === 0) {
      return true;
    } else {
      this.router.navigate(['home']);
      return false;
    }
  }
}
