import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IAccount } from '../models/account';

@Injectable({
  providedIn: 'root',
})
export class UserProfileStoreService {
  constructor() {}

  private _accountData: BehaviorSubject<IAccount | null> =
    new BehaviorSubject<IAccount | null>(null);
  private _accountDataFetched = false;

  setAccountData(account: IAccount | null) {
    this._accountData.next(account);
  }

  getAccountData(): Observable<IAccount | null> {
    return this._accountData.asObservable();
  }

  setAccountDataFetched() {
    this._accountDataFetched = true;
  }

  getAccountDataFetched(): boolean {
    return this._accountDataFetched;
  }
}
