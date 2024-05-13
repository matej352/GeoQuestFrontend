export interface ITestPublished {
  id: number;
  teacherId: number;
  duration: string;
  name: string;
  description: string;
  subject: string;
  finishedByStudentInstanceCount: number;
  instanceCount: number;
  active: boolean;
}
