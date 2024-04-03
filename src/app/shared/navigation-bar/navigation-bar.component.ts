import { Component, OnInit } from '@angular/core';
import { INavBarData, centarNavBarData } from './navbar-constants';
import { Router } from '@angular/router';
import { UserProfileStoreService } from 'src/app/storage/user-profile-store.service';
import { IAccount } from 'src/app/models/account';
import { EMPTY, Observable, catchError, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
  centarData!: INavBarData[];
  currentUser$!: Observable<IAccount | null>;
  currentUser!: IAccount | null;

  constructor(
    private _router: Router,
    private _userProfileStore: UserProfileStoreService,
    private _authenticationService: AuthenticationService,
    private _cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.centarData = centarNavBarData;
    this.currentUser$ = this._userProfileStore
      .getAccountData()
      .pipe(tap((user: IAccount | null) => (this.currentUser = user)));
  }

  onClick(link: string) {
    this._router
      .navigateByUrl('/home', { skipLocationChange: true })
      .then(() => {
        this._router.navigateByUrl(link);
      });
  }

  logout() {
    this._authenticationService
      .logout()
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        console.log(res);
        this._userProfileStore.setAccountData(null);
        this._router.navigate(['landing']);
        this._cookieService.deleteAll();
      });
  }
}
