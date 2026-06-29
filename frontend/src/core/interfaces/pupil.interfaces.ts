export interface IPupil {
  id: number;
  teacher_id: number;
  firstname: string;
  lastname: string;
  personal_number?: string;
  email?: string;
  phone?: string;
  alternate_number?: string;
  status?: string;
  activity_status?: string;
  module?: string;
  group_name?: string;
  credit?: string;
}