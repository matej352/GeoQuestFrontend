import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ITaskDto } from '../models/taskDto';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _apiURL = environment.apiURL;

  constructor(private http: HttpClient) {}

  createTask(task: ITaskDto): Observable<any> {
    return this.http.post<any>(`${this._apiURL}/Task/Create`, task, {
      withCredentials: true,
    });
  }

  getTasks(testId: number): Observable<any> {
    return this.http.get<any>(`${this._apiURL}/Task/Tasks?testId=${testId}`, {
      withCredentials: true,
    });
  }
}
