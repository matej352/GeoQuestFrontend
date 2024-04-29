import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ITaskInstanceAnswer } from '../models/taskInstanceAnswerDto';
import { ITaskInstanceGradeDto } from '../models/taskInstanceGradeDto';

@Injectable({
  providedIn: 'root',
})
export class TaskInstanceService {
  private _apiURL = environment.apiURL;

  constructor(private http: HttpClient) {}

  getTaskInstances(testInstanceId: number): Observable<any> {
    return this.http.get<any>(
      `${this._apiURL}/TestTaskInstance/OnGoingTestTaskInstances?testInstanceId=${testInstanceId}`,
      {
        withCredentials: true,
      }
    );
  }

  saveAnswer(answer: ITaskInstanceAnswer): Observable<any> {
    return this.http.post<any>(
      `${this._apiURL}/TestTaskInstance/SaveAnswer`,
      answer,
      {
        withCredentials: true,
      }
    );
  }

  gradeTaskInstance(grade: ITaskInstanceGradeDto): Observable<any> {
    return this.http.post<any>(
      `${this._apiURL}/TestTaskInstance/Grade`,
      grade,
      {
        withCredentials: true,
      }
    );
  }
}
