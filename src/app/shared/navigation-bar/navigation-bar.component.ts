import { Component, OnInit } from '@angular/core';
import { INavBarData } from './navbar-constants';
import { Router } from '@angular/router';
import { UserProfileStoreService } from 'src/app/storage/user-profile-store.service';
import { IAccount } from 'src/app/models/account';
import { EMPTY, Observable, catchError, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CookieService } from 'ngx-cookie-service';
import { ROLE_STUDENT, ROLE_TEACHER } from 'src/app/constants/global-constants';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
  navigationItems!: INavBarData[];
  currentUser$!: Observable<IAccount | null>;
  currentUser!: IAccount | null;

  constructor(
    private _router: Router,
    private _userProfileStore: UserProfileStoreService,
    private _authenticationService: AuthenticationService,
    private _cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this._userProfileStore.getAccountData().pipe(
      tap((user: IAccount | null) => {
        this.currentUser = user;
        this.navigationItems = this.getNavigtionItems();
      })
    );
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

  getNavigtionItems() {
    return [
      {
        id: 1,
        link: `/${
          this.currentUser?.role === ROLE_TEACHER ? 'teacher' : 'student'
        }/subjects`,
        text: 'Predmeti',
        role: [ROLE_TEACHER, ROLE_STUDENT],
      },
      {
        id: 2,
        link: `/${
          this.currentUser?.role === ROLE_TEACHER ? 'teacher' : 'student'
        }/exams`,
        text: 'Skice ispita',
        role: [ROLE_TEACHER],
      },
      {
        id: 3,
        link: '/about-us',
        text: 'Ispiti',
        role: [ROLE_TEACHER],
      },
      {
        id: 4,
        link: '/support-us',
        text: 'Support Us',
        role: [ROLE_TEACHER],
      },
      {
        id: 5,
        link: '/faq',
        text: 'FAQ',
        role: [ROLE_TEACHER],
      },
      {
        id: 6,
        link: '/media',
        text: 'Media',
        role: [ROLE_TEACHER],
      },
      {
        id: 7,
        link: '/blog/page/1',
        text: 'Blog',
        role: [ROLE_STUDENT],
      },
    ];
  }
}
