import { TaskType } from '../enums/task-type';

// TaskDto interface
export interface ITaskDto {
  id?: number;
  question: string;
  answer?: string;
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
