export interface User {
    id: number;
    name: string;
    password: string;
    isAdmin: boolean;
    isLeader: boolean;
    leaders?: string[];  // Relacionamento opcional
    subordinates?: string[];  // Relacionamento opcional
  }
  