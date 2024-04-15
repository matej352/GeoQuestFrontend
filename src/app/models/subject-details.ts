export interface ISubjectDetailsDto {
  id: number;
  name: string;
  description: string;
  students: IStudentDto[];
  testInstancesBase: ITestInstanceBaseDto[];
}

export interface ITestInstanceBaseDto {
  id: number;
  testName: string;
  instancesCount: number;
  active: boolean;
}

export interface IStudentDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
