import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IAccount } from '../models/account';

@Injectable({
  providedIn: 'root',
})
export class UserProfileStoreService {
  constructor() {}

  private _accountData!: IAccount | null;

  setAccountData(account: IAccount | null) {
    this._accountData = account;
  }

  getAccountData(): IAccount | null {
    return this._accountData;
  }
}
