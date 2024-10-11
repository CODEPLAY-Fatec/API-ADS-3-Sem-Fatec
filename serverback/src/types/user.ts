export interface User {
  id: number;
  name: string;
  email: string; // Adiciona o campo email
  password: string;
  isAdmin: boolean;
  leaders?: string[]; // Relacionamento opcional
  subordinates?: string[]; // Relacionamento opcional
}
