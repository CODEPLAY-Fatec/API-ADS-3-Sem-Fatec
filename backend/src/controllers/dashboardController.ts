import { Request, Response } from "express";
import { getAllUserSurveyAnswers, getBaseSurveysForTeam, getUserSurveysForTeam, getRelevantAnswersForBaseSurvey } from "../services/dashboardService";

export const getAllUserSurveyAnswersController = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    try {
        const surveyAnswers = await getAllUserSurveyAnswers(Number(user_id));
        res.status(200).json(surveyAnswers);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
};

export const getBaseSurveysForTeamController = async (req: Request, res: Response) => {
    const { user_id, team_id } = req.params;
    try {
        const baseSurveys = await getBaseSurveysForTeam(Number(user_id), Number(team_id));
        res.status(200).json(baseSurveys);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
};

export const getUserSurveysForTeamController = async (req: Request, res: Response) => {
    const { user_id, team_id } = req.params;
    try {
        const userSurveys = await getUserSurveysForTeam(Number(user_id), Number(team_id));
        res.status(200).json(userSurveys);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
};

export const getRelevantAnswersForBaseSurveyController = async (req: Request, res: Response) => {
    const { user_id, team_id, survey_uid } = req.params;
    console.log(req);
    
    try {
        const relevantAnswers = await getRelevantAnswersForBaseSurvey(Number(user_id), Number(team_id), Number(survey_uid));
        res.status(200).json(relevantAnswers);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
};