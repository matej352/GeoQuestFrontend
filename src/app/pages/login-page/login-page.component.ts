import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
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
  public usernameOrEmail = faUser;
  public password = faKey;

  public loginFailed: boolean = false;
  public loginErrorMessage!: string;

  public logInForm!: FormGroup;

  constructor(
    private _authenticationService: AuthenticationService,
    private _userProfileStore: UserProfileStoreService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.createSignInForm();
  }

  //#region [Setup]

  private createSignInForm(): void {
    this.logInForm = this._formBuilder.group({
      usernameOrEmail: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }

  //#endregion

  logIn() {
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
