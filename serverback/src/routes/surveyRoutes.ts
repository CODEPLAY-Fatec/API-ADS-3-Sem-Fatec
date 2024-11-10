import { Router } from "express";
import { answerSurveyController, createBaseSurveyController, createSurveyInstanceController, deleteBaseSurveyController, deleteSurveyInstanceController, getBaseSurveyByUIDController, getBaseSurveysController, getSurveyInstancesByUIDController, getSurveyInstancesController, getSurveyResponsesByBaseSurveyController, getSurveyResponsesBySurveyInstanceController, getSurveyResponsesByTargetController, getSurveyResponsesByUserController, getUserSurveysController, removeSurveyResponseController, setSurveyInstanceOpenController, updateBaseSurveyController } from "../controllers/surveyController";
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

router.get('/survey/available/:user_id', getUserSurveysController); // pega todas as pesquisas disponíveis de um usuário

router.post('/survey/answers/', answerSurveyController); // envia respostas de pesquisa
router.delete('/survey/answers/:survey_id', removeSurveyResponseController); // deleta respostas de pesquisa
router.get('/survey/answers/user/:user_id', getSurveyResponsesByUserController); // pega respostas de pesquisa por usuário
router.get('/survey/answers/base/:survey_uid', getSurveyResponsesByBaseSurveyController); // pega respostas de pesquisa por pesquisa base
router.get('/survey/answers/instance/:survey_id', getSurveyResponsesBySurveyInstanceController); // pega respostas de pesquisa por instância de pesquisa
router.get('/survey/answers/target/:target_id', getSurveyResponsesByTargetController); // pega respostas de pesquisa por alvo

export default router;