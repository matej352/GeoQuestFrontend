import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { EMPTY, catchError, switchMap } from 'rxjs';
import { ROLE_STUDENT, ROLE_TEACHER } from 'src/app/constants/global-constants';
import { RoleRouteParam } from 'src/app/guards/auth-guard.service';
import { IAccount } from 'src/app/models/account';
import { ILoginData } from 'src/app/models/login-data';
import { IRegisterData } from 'src/app/models/register-data';
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

  logInForm!: FormGroup;
  registerForm!: FormGroup;

  loginOpened = true;
  isTeacherCheckboxChecked: boolean = false;

  constructor(
    private _authenticationService: AuthenticationService,
    private _userProfileStore: UserProfileStoreService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _cookieService: CookieService,
    private _accountService: AccountService,
    private _snackBar: MatSnackBar
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
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }

  private createRegisterForm(): void {
    this.registerForm = new FormGroup(
      {
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
          validators: [Validators.required, Validators.minLength(8)],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required, Validators.minLength(8)],
        }),
        isTeacherCheckboxChecked: new FormControl(false),
      },
      [this.mustMatch('password', 'confirmPassword')]
    );
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
          this.loginFailed = true;
          return EMPTY;
        }),
        switchMap((_) => this._accountService.getAccountDetails())
      )
      .subscribe((user: IAccount) => {
        console.log(user);
        this._userProfileStore.setAccountData(user);
        this._router.navigate([
          user.role === ROLE_TEACHER
            ? RoleRouteParam.Teacher
            : RoleRouteParam.Student,
          user.role === ROLE_TEACHER ? 'subjects' : 'my-exams',
        ]);
      });
  }

  register() {
    let data = {
      firstName: this.registerForm.controls['firstName'].value,
      lastName: this.registerForm.controls['lastName'].value,
      email: this.registerForm.controls['email'].value,
      password: this.registerForm.controls['password'].value,
      confirmPassword: this.registerForm.controls['confirmPassword'].value,
      role: this.registerForm.controls['isTeacherCheckboxChecked'].value
        ? 0
        : 1,
    } as IRegisterData;

    this._accountService
      .registerAccount(data)
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.loginOpened = true;
        this._snackBar.open('Registracija uspješna, prijavite se!', 'Ok', {
          duration: 3000,
        });
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

  showRegisterForm() {
    this.loginOpened = false;
  }

  showLoginForm() {
    this.loginOpened = true;
  }

  logInError = (controlName: string, errorName: string) => {
    return (
      this.logInForm.controls[controlName].hasError(errorName) &&
      this.logInForm.controls[controlName].dirty
    );
  };

  registerError = (controlName: string, errorName: string) => {
    return (
      this.registerForm.controls[controlName].hasError(errorName) &&
      this.registerForm.controls[controlName].dirty
    );
  };

  mustMatch(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? { mismatch: true }
        : null;
    };
  }
}
