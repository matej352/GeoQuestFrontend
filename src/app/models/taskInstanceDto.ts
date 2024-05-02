import { MapType } from '../enums/map-type';
import { TaskType } from '../enums/task-type';

export interface ITaskInstanceDto {
  id: number;
  mapType: MapType;
  mapCenter: string;
  mapZoomLevel: number;
  question: string;
  answer?: string;
  nonMapPoint?: string;
  type: TaskType;
  options?: ITaskInstanceOptionsDto;
  testInstanceId: number;
}

export interface ITaskInstanceOptionsDto {
  id: number;
  singleSelect: boolean;
  optionAnswers: ITaskInstanceOptionAnswerDto[];
}

export interface ITaskInstanceOptionAnswerDto {
  id: number;
  content: string;
}
