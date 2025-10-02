import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentTable } from '@/components/StudentTable';
import { StudentDialog } from '@/components/StudentDialog';
import { Student, CreateStudentInput } from '@/types/student';
import { toast } from 'sonner';
import { GraduationCap, LogOut, Plus, Users } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();

  // Carregar alunos do localStorage na inicialização
  useEffect(() => {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }
  }, []);

  // Salvar alunos no localStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleCreateStudent = (data: CreateStudentInput) => {
    const newStudent: Student = {
      ...data,
      id: Date.now(),
    };
    setStudents([...students, newStudent]);
    toast.success('Aluno criado com sucesso!');
    setIsDialogOpen(false);
  };

  const handleUpdateStudent = (id: number, data: CreateStudentInput) => {
    setStudents(students.map(s => s.id === id ? { ...data, id } : s));
    toast.success('Aluno atualizado com sucesso!');
    setIsDialogOpen(false);
    setEditingStudent(undefined);
  };

  const handleDeleteStudent = (id: number) => {
    setStudents(students.filter(s => s.id !== id));
    toast.success('Aluno excluído com sucesso!');
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingStudent(undefined);
  };

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Sistema Escolar</h1>
                <p className="text-sm text-muted-foreground">Painel Administrativo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.perfil}</p>
              </div>
              <Button variant="outline" onClick={logout} size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="gradient-card border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Alunos
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{students.length}</div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cursos Ativos
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {new Set(students.map(s => s.curso)).size}
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-accent">Online</div>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card className="gradient-card border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciar Alunos</CardTitle>
                <CardDescription>
                  Visualize, edite e gerencie os alunos cadastrados
                </CardDescription>
              </div>
              <Button onClick={() => setIsDialogOpen(true)} className="gradient-primary hover:opacity-90 transition-smooth">
                <Plus className="w-4 h-4 mr-2" />
                Novo Aluno
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <StudentTable
              students={students}
              onEdit={handleEdit}
              onDelete={handleDeleteStudent}
            />
          </CardContent>
        </Card>
      </main>

      <StudentDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        student={editingStudent}
        onSubmit={editingStudent
          ? (data) => handleUpdateStudent(editingStudent.id, data)
          : handleCreateStudent
        }
      />
    </div>
  );
}
