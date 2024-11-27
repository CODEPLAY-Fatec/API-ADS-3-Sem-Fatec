import { Router } from 'express';
import { getAllUserSurveyAnswersController, getBaseSurveysForTeamController, getUserSurveysForTeamController, getRelevantAnswersForBaseSurveyController } from '../controllers/dashboardController';

const router = Router();

router.get('/dashboard/user/:user_id/surveys', getAllUserSurveyAnswersController);
router.get('/dashboard/user/:user_id/team/:team_id/base-surveys', getBaseSurveysForTeamController);
router.get('/dashboard/user/:user_id/team/:team_id/surveys', getUserSurveysForTeamController);
router.get('/dashboard/user/:user_id/team/:team_id/survey/:survey_uid/answers', getRelevantAnswersForBaseSurveyController);
         // menooooooooooooooooooooooooooooooooooooooooor rota do API be like
export default router;