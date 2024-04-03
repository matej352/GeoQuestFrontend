import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { UserProfileStoreService } from '../storage/user-profile-store.service';
import {
  Observable,
  catchError,
  delay,
  finalize,
  map,
  of,
  take,
  tap,
} from 'rxjs';
import { IAccount } from '../models/account';
import { AccountService } from '../services/account.service';
import { ROLE_STUDENT, ROLE_TEACHER } from '../constants/global-constants';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private _userProfileStore: UserProfileStoreService,
    private _router: Router,
    private _accountService: AccountService
  ) {}

  routeParam!: any;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    this.getRoleFromRoute(route);

    if (this._userProfileStore.getAccountDataFetched()) {
      return this._userProfileStore.getAccountData().pipe(
        map((user: IAccount | null) => {
          // CASE: Account data fetched - user logged in
          if (user) {
            if (
              user.role === ROLE_TEACHER &&
              this.routeParam === RoleRouteParam.Teacher
            ) {
              return true;
            } else if (
              user.role === ROLE_STUDENT &&
              this.routeParam === RoleRouteParam.Student
            ) {
              return true;
            } else {
              return false;
            }
          }
          // CASE: Account data fetched - user not logged in
          else {
            return false;
          }
        })
      );
    } else {
      return this._accountService.getAccountDetails().pipe(
        catchError((err) => {
          console.log(err);
          this._userProfileStore.setAccountData(null);
          this._router.navigate(['landing']);
          return of(false);
        }),
        map((account: IAccount) => {
          this._userProfileStore.setAccountData(account);
          if (
            account.role === ROLE_TEACHER &&
            this.routeParam === RoleRouteParam.Teacher
          ) {
            return true;
          } else if (
            account.role === ROLE_STUDENT &&
            this.routeParam === RoleRouteParam.Student
          ) {
            return true;
          } else {
            this._router.navigate(['landing']);
            return false;
          }
        }),
        finalize(() => this._userProfileStore.setAccountDataFetched())
      );
    }
  }

  getRoleFromRoute(route: ActivatedRouteSnapshot): void {
    this.routeParam = route.params['role'];
  }
}

export enum RoleRouteParam {
  Student = 'student',
  Teacher = 'teacher',
}
