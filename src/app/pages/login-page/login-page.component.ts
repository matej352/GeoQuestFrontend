import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EMPTY, catchError } from 'rxjs';
import { ILoginData } from 'src/app/models/login-data';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserProfileStoreService } from 'src/app/storage/user-profile-store.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  constructor(
    private _authenticationService: AuthenticationService,
    private _userProfileStore: UserProfileStoreService,
    private _router: Router,
    private _cookieService: CookieService
  ) {}

  ngOnInit(): void {}

  login() {
    let data = {
      email: 'nobilo@gmail.com',
      password: 'lozinka',
    } as ILoginData;

    this._authenticationService
      .login(data)
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        console.log(res);
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
        this._cookieService.deleteAll();
      });
  }

  redirect() {
    this._router.navigate(['exams']);
  }
}
