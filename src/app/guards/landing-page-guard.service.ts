import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, catchError, finalize, map, of, tap } from 'rxjs';
import { UserProfileStoreService } from '../storage/user-profile-store.service';
import { ROLE_TEACHER } from '../constants/global-constants';
import { AccountService } from '../services/account.service';
import { IAccount } from '../models/account';

@Injectable({
  providedIn: 'root',
})
export class LandingPageGuardService implements CanActivate {
  constructor(
    private _userProfileStore: UserProfileStoreService,
    private _router: Router,
    private _accountService: AccountService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    // CASE: Account data fetched
    if (this._userProfileStore.getAccountDataFetched()) {
      return this._userProfileStore.getAccountData().pipe(
        map((user: IAccount | null) => {
          // CASE: Account data fetched - user logged in
          if (user) {
            let role = user.role === ROLE_TEACHER ? 'teacher' : 'student';

            if (user.role === ROLE_TEACHER) {
              this._router.navigate([role, 'subjects']);
            } else {
              this._router.navigate([role, 'my-exams']);
            }

            return false;
          }
          // CASE: Account data fetched - user not logged in
          else {
            return true;
          }
        })
      );
    } else {
      return this._accountService.getAccountDetails().pipe(
        catchError((err) => {
          this._userProfileStore.setAccountData(null);
          return of(true);
        }),
        tap((account: IAccount) => {
          if (account.id) {
            this._userProfileStore.setAccountData(account);
            let role = account.role === ROLE_TEACHER ? 'teacher' : 'student';

            if (account.role === ROLE_TEACHER) {
              this._router.navigate([role, 'subjects']);
            } else {
              this._router.navigate([role, 'my-exams']);
            }
          }
        }),
        map((account: IAccount) => {
          if (account.id) {
            return false;
          } else {
            return true;
          }
        }),
        finalize(() => this._userProfileStore.setAccountDataFetched())
      );
    }
  }
}
