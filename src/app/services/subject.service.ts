import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private _apiURL = environment.apiURL;

  constructor(private http: HttpClient) {}

  getSubjects(): Observable<any> {
    return this.http.get<any>(`${this._apiURL}/Subject/Subjects`, {
      withCredentials: true,
    });
  }
}
