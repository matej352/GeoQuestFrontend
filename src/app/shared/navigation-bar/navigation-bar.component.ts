import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { INavBarData } from './navbar-constants';
import { NavigationEnd, Router } from '@angular/router';
import { UserProfileStoreService } from 'src/app/storage/user-profile-store.service';
import { IAccount } from 'src/app/models/account';
import { EMPTY, Observable, catchError, filter, tap } from 'rxjs';
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

  ongoingExamOpened = false;

  constructor(
    private _router: Router,
    private _userProfileStore: UserProfileStoreService,
    private _authenticationService: AuthenticationService,
    private _cookieService: CookieService,
    private _cdr: ChangeDetectorRef
  ) {
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url.includes('ongoing-exam')) {
          this.ongoingExamOpened = true;
        } else {
          this.ongoingExamOpened = false;
        }

        setTimeout(() => {
          this.underlineCurrentNavbarItem(event.url);
        }, 0);
      });
  }

  underlineCurrentNavbarItem(url: any) {
    if (url.includes('/teacher/subjects')) {
      this.navigationItems.find((item) => item.id === 1)!.isCurrent = true;
      this.removeUnderlineFromOthers(1);
    } else if (url.includes('/draft-exams')) {
      this.navigationItems.find((item) => item.id === 2)!.isCurrent = true;
      this.removeUnderlineFromOthers(2);
    } else if (url.includes('/teacher/exams')) {
      this.navigationItems.find((item) => item.id === 3)!.isCurrent = true;
      this.removeUnderlineFromOthers(3);
    } else if (url.includes('/student/previous-exams')) {
      this.navigationItems.find((item) => item.id === 6)!.isCurrent = true;
      this.removeUnderlineFromOthers(6);
    } else if (url.includes('/student/my-exams')) {
      this.navigationItems.find((item) => item.id === 7)!.isCurrent = true;
      this.removeUnderlineFromOthers(7);
    }
  }

  removeUnderlineFromOthers(id: number) {
    this.navigationItems.forEach((item) => {
      if (item.id !== id) {
        item.isCurrent = false;
      }
    });
  }

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
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this._userProfileStore.setAccountData(null);
        this._router.navigate(['landing']);

        this._cookieService.delete(
          'GeoQuestCookie',
          '/',
          'localhost',
          false,
          'Lax'
        );
      });
  }

  getNavigtionItems() {
    return [
      {
        id: 1,
        link: '/teacher/subjects',
        text: 'Predmeti',
        role: [ROLE_TEACHER],
      },
      {
        id: 2,
        link: `/${
          this.currentUser?.role === ROLE_TEACHER ? 'teacher' : 'student'
        }/draft-exams`,
        text: 'Skice ispita',
        role: [ROLE_TEACHER],
      },
      {
        id: 3,
        link: 'teacher/exams',
        text: 'Ispiti',
        role: [ROLE_TEACHER],
      },
      {
        id: 6,
        link: '/student/previous-exams',
        text: 'Prethodni ispiti',
        role: [ROLE_STUDENT],
      },
      {
        id: 7,
        link: '/student/my-exams',
        text: 'Ispiti',
        role: [ROLE_STUDENT],
      },
    ];
  }
}
