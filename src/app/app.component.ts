import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { IAccount } from './models/account';
import { UserProfileStoreService } from './storage/user-profile-store.service';
import { EMPTY, catchError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'geo-quest';

  constructor(
    private _accountService: AccountService,
    private _userProfileStore: UserProfileStoreService
  ) {}

  ngOnInit(): void {
    this._accountService
      .getAccountDetails()
      .pipe(
        catchError((err) => {
          console.log(err);
          this._userProfileStore.setAccountData(null);
          return EMPTY;
        })
      )
      .subscribe((account: IAccount) => {
        this._userProfileStore.setAccountData(account);
      });
  }
}
