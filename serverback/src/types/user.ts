export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  phoneNumber : string;
  leaders?: string[]; // Relacionamento opcional
  subordinates?: string[]; // Relacionamento opcional
  isTeamLeader?: boolean;  //funçao opcional 
}
