import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { EMPTY, Observable, catchError, of, tap } from 'rxjs';

import { IAccount } from '../models/account';
import { AccountService } from '../services/account.service';
import { UserProfileStoreService } from '../storage/user-profile-store.service';

@Injectable({ providedIn: 'root' })
export class CurrentUserResolver implements Resolve<IAccount> {
  constructor(
    private _accountService: AccountService,
    private _userProfileStore: UserProfileStoreService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IAccount> {
    return this._accountService.getAccountDetails().pipe(
      catchError((err) => {
        console.log(err);
        this._userProfileStore.setAccountData(null);
        return EMPTY;
      }),
      tap((account: IAccount) => {
        this._userProfileStore.setAccountData(account);
      })
    );
  }
}
