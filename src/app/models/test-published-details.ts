export interface ITestPublishedDetails {
  id: number;
  duration: string; // Assuming TimeSpan is represented as a string
  name: string;
  description: string;
  subject: string;
  finishedInstanceCount: number;
  instanceCount: number;
  active: boolean;
  checkedInstanceCount: number;
  avgElapsedTime: string; // Assuming TimeSpan is represented as a string
  totalPoints: number;
  avgPoints: number;
  testInstances: ITestInstanceForTeacher[];
}

export interface ITestInstanceForTeacher {
  id: number;
  student: string;
  elapsedTime: string; // Assuming TimeSpan is represented as a string
  points: number;
  finished: boolean;
  checked: boolean;
}
