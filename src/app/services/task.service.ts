import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TaskDto } from '../models/taskDto';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _apiURL = environment.apiURL;

  constructor(private http: HttpClient) {}

  createTask(task: TaskDto): Observable<any> {
    return this.http.post<any>(`${this._apiURL}/Task/Create`, task, {
      withCredentials: true,
    });
  }
}
