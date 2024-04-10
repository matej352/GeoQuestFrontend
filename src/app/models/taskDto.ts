import { TaskType } from '../enums/task-type';

// TaskDto interface
export interface TaskDto {
  question: string;
  answer?: string;
  type: TaskType;
  options?: OptionsDto;
}

// OptionsDto interface
interface OptionsDto {
  singleSelect: boolean;
  optionAnswers: OptionAnswerDto[];
}

// OptionAnswerDto interface
export interface OptionAnswerDto {
  content: string;
  correct: boolean;
}
