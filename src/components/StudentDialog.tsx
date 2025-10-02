import { useEffect, useState } from 'react';
import { Student, CreateStudentInput } from '@/types/student';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface StudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student;
  onSubmit: (data: CreateStudentInput) => void;
}

export function StudentDialog({ open, onOpenChange, student, onSubmit }: StudentDialogProps) {
  const [formData, setFormData] = useState<CreateStudentInput>({
    matricula: '',
    nome_completo: '',
    curso: '',
    data_nascimento: '',
  });

  useEffect(() => {
    if (student) {
      setFormData({
        matricula: student.matricula,
        nome_completo: student.nome_completo,
        curso: student.curso,
        data_nascimento: student.data_nascimento,
      });
    } else {
      setFormData({
        matricula: '',
        nome_completo: '',
        curso: '',
        data_nascimento: '',
      });
    }
  }, [student, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.matricula || !formData.nome_completo || !formData.curso || !formData.data_nascimento) {
      toast.error('Todos os campos são obrigatórios.');
      return;
    }

    onSubmit(formData);
    setFormData({
      matricula: '',
      nome_completo: '',
      curso: '',
      data_nascimento: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{student ? 'Editar Aluno' : 'Novo Aluno'}</DialogTitle>
          <DialogDescription>
            {student
              ? 'Atualize as informações do aluno abaixo.'
              : 'Preencha os dados do novo aluno.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                value={formData.matricula}
                onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                placeholder="Ex: 2024001"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nome_completo">Nome Completo</Label>
              <Input
                id="nome_completo"
                value={formData.nome_completo}
                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                placeholder="Ex: João da Silva"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="curso">Curso</Label>
              <Input
                id="curso"
                value={formData.curso}
                onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                placeholder="Ex: Engenharia de Software"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="data_nascimento">Data de Nascimento</Label>
              <Input
                id="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="gradient-primary hover:opacity-90 transition-smooth">
              {student ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
