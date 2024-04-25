export interface ITestInstanceResult {
  testInstanceId: number;
  allChecked: boolean;
  totalPoints: number;
  successPercentage: number;
  testTasks: ITestTaskResult[];
}

export interface ITestTaskResult {
  id: number;
  type: TaskType;
  question: string;
  correctAnswer: string;
  options: ITestTaskOptionsResult;
  studentAnswer: string;
  checked: boolean;
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
