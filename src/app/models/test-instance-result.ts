import { MapType } from '../enums/map-type';

export interface ITestInstanceResult {
  testInstanceId: number;
  student: string;
  testName: string;
  description: string;
  allChecked: boolean;
  studentTotalPoints: number;
  testTotalPoints: number;
  successPercentage: number;
  testTasks: ITestTaskResult[];
}

export interface ITestTaskResult {
  id: number;
  mapType: MapType;
  mapCenter: string;
  mapZoomLevel: number;
  type: TaskType;
  question: string;
  correctAnswer: string;
  options: ITestTaskOptionsResult;
  studentAnswer: string;
  checked: boolean;
  nonMapPoint?: string; //ovo ima samo non-map task
  isCorrect: boolean;
}

export interface ITestTaskOptionAnswerResult {
  id: number;
  content: string;
  correct: boolean;
}

export interface ITestTaskOptionsResult {
  id: number;
  singleSelect: boolean;
  optionAnswers: ITestTaskOptionAnswerResult[];
}
