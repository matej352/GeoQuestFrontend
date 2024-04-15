import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ILoginData } from '../models/login-data';
import { Observable } from 'rxjs';
import { IRegisterData } from '../models/register-data';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private _apiURL = environment.apiURL;

  constructor(private http: HttpClient) {}

  getAccountDetails(): Observable<any> {
    return this.http.get<any>(`${this._apiURL}/Account/Details`, {
      withCredentials: true,
    });
  }

  registerAccount(data: IRegisterData): Observable<any> {
    return this.http.post<any>(`${this._apiURL}/Account/Register`, data, {
      withCredentials: true,
    });
  }

  getStudentAccounts(subjectId: number): Observable<any> {
    return this.http.get<any>(
      `${this._apiURL}/Account/Students?subjectId=${subjectId}`,
      {
        withCredentials: true,
      }
    );
  }
}
