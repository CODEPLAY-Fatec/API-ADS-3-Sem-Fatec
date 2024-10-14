export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  leaders?: string[]; // Relacionamento opcional
  subordinates?: string[]; // Relacionamento opcional
  isTeamLeader?: boolean;  //funçao opcional 
}
