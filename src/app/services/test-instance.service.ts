import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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
}
