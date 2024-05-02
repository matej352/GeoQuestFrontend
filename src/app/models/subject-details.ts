import { ITestPublished } from './test-published';

export interface ISubjectDetailsDto {
  id: number;
  name: string;
  description: string;
  students: IStudentDto[];
  publishedTests: ITestPublished[];
}

export interface IStudentDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
