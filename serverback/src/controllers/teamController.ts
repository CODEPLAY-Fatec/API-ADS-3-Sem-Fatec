const { addTeam, assignLeader, assignMember,getAllTeams,getAllUsers,getLeadersByTeamId,getMembersByTeamId,removeTeam,removeUserFromTeam } = require('../services/teamService');
import { Request, Response } from 'express';


// Controlador para adicionar um time
export const addTeamController = async (req:Request, res:Response) => {
    const { name } = req.body;
    try {
        const teamId = await addTeam(name);
        res.status(201).json({ teamId, message: 'Team created successfully' });
    }  catch (error: any) {
        res.status(500).json({ error: error.message });
      }
};

// Controlador para associar um líder a um time
export const assignLeaderController = async (req:Request, res:Response) => {
    const { teamId } = req.params;
    const { userId } = req.body;
    try {
        await assignLeader(teamId, userId); 
        res.status(201).json({ message: 'Leader assigned to team successfully' });
    }  catch (error: any) {
        res.status(500).json({ error: error.message });
      }
};

// Controlador para associar um membro a um time
export const assignMemberController = async (req:Request, res:Response) => {
    const { teamId } = req.params;
    const { userId } = req.body;
    try {
        await assignMember(teamId, userId); 
        res.status(201).json({ message: 'Member assigned to team successfully' });
    }  catch (error: any) {
        res.status(500).json({ error: error.message });
      }
};

export const getTeamsController = async (req: Request, res: Response) => {
    try {
      const teams = await getAllTeams();
      res.status(200).json(teams);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // Controlador para buscar todos os usuários
export const getUsersController = async (req: Request, res: Response) => {
  try {
      const users = await getAllUsers();
      res.status(200).json(users);
  } catch (error: any) {
      res.status(500).json({ error: error.message });
  }
};

// Controlador para buscar líderes de um time
export const getLeadersController = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  try {
      const leaders = await getLeadersByTeamId(parseInt(teamId));
      res.status(200).json(leaders); // Retorna a lista de líderes
  } catch (error: any) {
      res.status(500).json({ error: error.message });
  }
};

// Controlador para buscar membros de um time
export const getMembersController = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  try {
      const members = await getMembersByTeamId(parseInt(teamId));
      res.status(200).json(members); // Retorna a lista de membros
  } catch (error: any) {
      res.status(500).json({ error: error.message });
  }
};

export const removeTeamController = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  try {
      await removeTeam(parseInt(teamId));
      res.status(200).json({ message: 'Time removido com sucesso!' });
  } catch (error: any) {
      res.status(500).json({ error: error.message });
  }
};

export const removeUserFromTeamController = async (req: Request, res: Response) => {
  const { teamId, userId } = req.params;
  try {
      await removeUserFromTeam(parseInt(teamId), parseInt(userId));
      res.status(200).json({ message: 'Usuário removido do time com sucesso!' });
  } catch (error: any) {
      res.status(500).json({ error: error.message });
  }
};
