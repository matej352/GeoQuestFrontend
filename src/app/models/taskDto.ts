import { MapType } from '../enums/map-type';
import { TaskType } from '../enums/task-type';

// TaskDto interface
export interface ITaskDto {
  id?: number;
  mapType: MapType;
  mapCenter: string;
  mapZoomLevel: number;
  testId: number;
  question: string;
  answer?: string;
  nonMapPoint?: string;
  type: TaskType;
  options?: IOptionsDto;
}

// OptionsDto interface
interface IOptionsDto {
  singleSelect: boolean;
  optionAnswers: IOptionAnswerDto[];
}

// OptionAnswerDto interface
export interface IOptionAnswerDto {
  content: string;
  correct: boolean;
}
