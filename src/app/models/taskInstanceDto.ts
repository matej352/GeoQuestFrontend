import { TaskType } from '../enums/task-type';

export interface ITaskInstanceDto {
  id: number;
  question: string;
  studentAnswer: string;
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
