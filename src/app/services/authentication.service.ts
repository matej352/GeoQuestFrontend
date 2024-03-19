import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ILoginData } from '../models/login-data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _apiURL = environment.apiURL;

  constructor(private http: HttpClient) {}

  login(user: ILoginData): Observable<any> {
    return this.http.post<any>(`${this._apiURL}/Auth/Login`, user, {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this._apiURL}/Auth/Logout`, {
      withCredentials: true,
    });
  }
}
