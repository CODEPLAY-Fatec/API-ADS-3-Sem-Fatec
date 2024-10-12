import { Router } from 'express';
import { addTeamController, assignLeaderController, assignMemberController,getTeamsController,getUsersController,getLeadersController,getMembersController} from  '../controllers/teamController';

const router = Router();

router.post('/team', addTeamController); // Rota para adicionar um time
router.post('/team/:teamId/leader', assignLeaderController); // Rota para associar um líder a um time
router.post('/team/:teamId/member', assignMemberController); // Rota para associar um membro a um time
router.get('/team', getTeamsController)  //rota para pegar todos os times
router.get('/user', getUsersController); // Nova rota para buscar todos os usuários
router.get('/team/:teamId/leaders', getLeadersController); // Rota para buscar líderes
router.get('/team/:teamId/members', getMembersController); // Rota para pegar os membros e mostrar la no dropwown


export default router;
