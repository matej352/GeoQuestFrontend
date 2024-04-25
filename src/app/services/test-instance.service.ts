import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ITestInstanceFinish,
  IUpdateElapsedTime,
} from '../models/test-instance-finish';

@Injectable({
  providedIn: 'root',
})
export class TestInstanceService {
  private _apiURL = environment.apiURL;

  constructor(private http: HttpClient) {}

  getTestInstances(): Observable<any> {
    return this.http.get<any>(`${this._apiURL}/TestInstance/TestInstances`, {
      withCredentials: true,
    });
  }

  getPreviousTestInstances(): Observable<any> {
    return this.http.get<any>(
      `${this._apiURL}/TestInstance/TestInstances/Previous`,
      {
        withCredentials: true,
      }
    );
  }

  getTestInstanceResult(testInstanceId: number): Observable<any> {
    return this.http.get<any>(
      `${this._apiURL}/TestInstance/TestInstance/Result?testInstanceId=${testInstanceId}`,
      {
        withCredentials: true,
      }
    );
  }

  getTestInstance(testInstanceId: number): Observable<any> {
    return this.http.get<any>(
      `${this._apiURL}/TestInstance/TestInstance?testInstanceId=${testInstanceId}`,
      {
        withCredentials: true,
      }
    );
  }

  finishTestInstance(finish: ITestInstanceFinish): Observable<any> {
    return this.http.post<any>(`${this._apiURL}/TestInstance/Finish`, finish, {
      withCredentials: true,
    });
  }

  startTestInstance(instanceId: number): Observable<any> {
    return this.http.post<any>(
      `${this._apiURL}/TestInstance/Start`,
      instanceId,
      {
        withCredentials: true,
      }
    );
  }

  updateElapsedTime(data: IUpdateElapsedTime): Observable<any> {
    return this.http.post<any>(
      `${this._apiURL}/TestInstance/ElapsedTime`,
      data,
      {
        withCredentials: true,
      }
    );
  }
}
