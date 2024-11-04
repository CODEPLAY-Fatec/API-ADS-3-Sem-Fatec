import { Router } from "express";
import { createBaseSurveyController, createSurveyInstanceController, deleteBaseSurveyController, deleteSurveyInstanceController, getBaseSurveyByUIDController, getBaseSurveysController, getSurveyInstancesByUIDController, getSurveyInstancesController, getUserSurveysController, setSurveyInstanceOpenController, updateBaseSurveyController } from "../controllers/surveyController";
const router = Router();

router.post('/survey/base', createBaseSurveyController); // cria pesquisa base
router.get('/survey/base', getBaseSurveysController); // pega pesquisas base
router.get('/survey/base/:uid', getBaseSurveyByUIDController); // pega pesquisa base por uid
router.put('/survey/base', updateBaseSurveyController); // atualiza pesquisa base
router.delete('/survey/base/:uid', deleteBaseSurveyController); // deleta pesquisa base

router.post('/survey/instance/:survey_uid', createSurveyInstanceController); // cria instância de pesquisa
router.get('/survey/instance', getSurveyInstancesController); // pega instâncias de pesquisa
router.get('/survey/instance/:uid', getSurveyInstancesByUIDController); // pega instâncias de pesquisa por uid
router.delete('/survey/instance/:survey_id', deleteSurveyInstanceController); // deleta instância de pesquisa
router.put('/survey/instance/:survey_id/:state', setSurveyInstanceOpenController); // abre ou fecha instância de pesquisa

router.get('/survey/available/:user_id', getUserSurveysController); // abre ou fecha instância de pesquisa

export default router;