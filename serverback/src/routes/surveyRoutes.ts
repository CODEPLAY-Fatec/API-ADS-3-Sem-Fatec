import { Router } from "express";
import { createSurveyController, getSurveyController, getSurveysController, updateSurveyController, deleteSurveyController } from "../controllers/surveyController";

const router = Router();

router.post('/survey/', createSurveyController);
router.get('/survey/:survey_id', getSurveyController);
router.get('/survey/all/:team_id', getSurveysController);
router.put('/survey/:id', updateSurveyController);
router.delete('/survey/:id', deleteSurveyController);

export default router;