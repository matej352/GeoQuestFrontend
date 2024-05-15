import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ITest } from '../models/test';
import { ICreateTest } from '../models/test-create';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  //private _apiURL = 'https://localhost:7161';
  private _apiURL = 'https://geoquest20240515160138.azurewebsites.net';

  constructor(private http: HttpClient) {}

  getTests(): Observable<any> {
    return this.http.get<any>(`${this._apiURL}/Test/Tests`, {
      withCredentials: true,
    });
  }

  getPublishedTests(): Observable<any> {
    return this.http.get<any>(`${this._apiURL}/Test/Tests/Published`, {
      withCredentials: true,
    });
  }

  getPublishedTestOverview(testInstanceBaseId: number): Observable<any> {
    return this.http.get<any>(
      `${this._apiURL}/Test/Test/Published/Overview?testInstanceBaseId=${testInstanceBaseId}`,
      {
        withCredentials: true,
      }
    );
  }

  getTest(testId: number): Observable<any> {
    return this.http.get<any>(`${this._apiURL}/Test/Test?testId=${testId}`, {
      withCredentials: true,
    });
  }

  getTestByTestInstnaceId(testInstanceId: number): Observable<any> {
    return this.http.get<any>(
      `${this._apiURL}/Test/TestByTestInstanceId?testInstanceId=${testInstanceId}`,
      {
        withCredentials: true,
      }
    );
  }

  createTest(data: ICreateTest): Observable<any> {
    return this.http.post<any>(`${this._apiURL}/Test/Create`, data, {
      withCredentials: true,
    });
  }

  updateTest(data: ICreateTest): Observable<any> {
    return this.http.put<any>(`${this._apiURL}/Test/Update`, data, {
      withCredentials: true,
    });
  }

  publishTest(testId: number): Observable<any> {
    return this.http.post<any>(`${this._apiURL}/Test/Publish`, testId, {
      withCredentials: true,
    });
  }

  closeTest(testInstanceBaseId: number): Observable<any> {
    return this.http.post<any>(
      `${this._apiURL}/Test/Close`,
      testInstanceBaseId,
      {
        withCredentials: true,
      }
    );
  }
}
