import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISubject } from '../models/subject';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  //private _apiURL = 'https://localhost:7161';
  private _apiURL = 'https://geoquest20240515160138.azurewebsites.net';

  constructor(private http: HttpClient) {}

  getSubjects(): Observable<any> {
    return this.http.get<any>(`${this._apiURL}/Subject/Subjects`, {
      withCredentials: true,
    });
  }

  getSubjectsList(): Observable<any> {
    return this.http.get<any>(`${this._apiURL}/Subject/Subjects/List`, {
      withCredentials: true,
    });
  }

  getSubject(id: number): Observable<any> {
    return this.http.get<any>(
      `${this._apiURL}/Subject/Subject?subjectId=${id}`,
      {
        withCredentials: true,
      }
    );
  }

  createSubject(data: ISubject): Observable<any> {
    return this.http.post<any>(`${this._apiURL}/Subject/Create`, data, {
      withCredentials: true,
    });
  }

  updateSubject(data: ISubject): Observable<any> {
    return this.http.put<any>(`${this._apiURL}/Subject/Update`, data, {
      withCredentials: true,
    });
  }

  addStudents(subjectId: number, studentIds: number[]): Observable<any> {
    return this.http.post<any>(
      `${this._apiURL}/Subject/Students?subjectId=${subjectId}`,
      studentIds,
      {
        withCredentials: true,
      }
    );
  }
}
