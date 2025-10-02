export interface Student {
  id: number;
  matricula: string;
  nome_completo: string;
  curso: string;
  data_nascimento: string;
}

export type CreateStudentInput = Omit<Student, 'id'>;
