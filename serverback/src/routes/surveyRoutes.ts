import { Router } from "express";
import { createSurveyController, deleteSurveyController, getSurveyController, getSurveysByTeamController, getSurveysController, submitSurveyResponseController, updateSurveyController } from "../controllers/surveyController";

const router = Router();

router.post('/survey/', createSurveyController);
router.get('/survey/:survey_id', getSurveyController);
router.get('/survey/all/:team_id', getSurveysController);
router.put('/survey/:id', updateSurveyController);
router.delete('/survey/:id', deleteSurveyController);
router.get('/surveys/team/:teamId', getSurveysByTeamController);
router.post('/surveys/response', submitSurveyResponseController);


export default router;