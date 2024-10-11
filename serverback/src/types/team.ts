import { User } from '../types/user'; 

export interface Team {
    id: number;
    name: string;
    leaders?: User[]; // Relacionamento opcional com líderes
    members?: User[]; // Relacionamento opcional com membros
  }