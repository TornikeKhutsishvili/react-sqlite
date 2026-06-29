export interface IExam {
  id: number;
  teacher_id: number;
  name: string;
  date: string;
  time_from?: string;
  time_to?: string;
}

export interface IExamPayload {
  name: string;
  date: string;
  timeFrom?: string;
  timeTo?: string;
}