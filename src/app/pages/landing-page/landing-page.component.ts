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
import { EMPTY, catchError, switchMap } from 'rxjs';
import { ROLE_STUDENT, ROLE_TEACHER } from 'src/app/constants/global-constants';
import { RoleRouteParam } from 'src/app/guards/auth-guard.service';
import { IAccount } from 'src/app/models/account';
import { ILoginData } from 'src/app/models/login-data';
import { AccountService } from 'src/app/services/account.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserProfileStoreService } from 'src/app/storage/user-profile-store.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  email = faUser;
  password = faKey;

  loginFailed: boolean = false;
  loginErrorMessage!: string;

  logInForm!: FormGroup;
  registerForm!: FormGroup;

  loginOpened = true;

  constructor(
    private _authenticationService: AuthenticationService,
    private _userProfileStore: UserProfileStoreService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _cookieService: CookieService,
    private _accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.createSignInForm();
    this.createRegisterForm();
  }

  //#region [Setup]

  private createSignInForm(): void {
    this.logInForm = this._formBuilder.group({
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(50),
          Validators.email,
        ],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(7)],
      }),
    });
  }

  private createRegisterForm(): void {
    this.registerForm = this._formBuilder.group({
      firstName: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      lastName: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(50),
          Validators.email,
        ],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(7)],
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(7)],
      }),
    });
  }

  //#endregion

  login() {
    let data = {
      email: this.logInForm.controls['email'].value,
      password: this.logInForm.controls['password'].value,
    } as ILoginData;

    this._authenticationService
      .login(data)
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
        switchMap((_) => this._accountService.getAccountDetails())
      )
      .subscribe((user: IAccount) => {
        console.log(user);
        this._userProfileStore.setAccountData(user);
        this._router.navigate([
          'home',
          user.role === ROLE_TEACHER
            ? RoleRouteParam.Teacher
            : RoleRouteParam.Student,
        ]);
      });
  }

  register() {}

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

  showRegisterForm() {
    this.loginOpened = false;
  }
}
