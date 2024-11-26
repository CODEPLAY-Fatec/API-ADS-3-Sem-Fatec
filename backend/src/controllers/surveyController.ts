import { Request, Response } from "express";
import  * as surveyService from "../services/surveyService";
import { BaseSurvey, SurveyCategory } from "../types/Survey";

export const createBaseSurveyController = async (req: Request, res: Response) => {
    const survey: BaseSurvey = req.body.survey;
    const open: boolean = req.body.open;
    const teams: [] = req.body.teams
    const category: SurveyCategory = req.body.category;
    const auxiliarySurvey = req.body.auxiliarySurvey;
    try {
        await surveyService.createBaseSurvey(survey, open, teams, category, auxiliarySurvey);
        res.status(201).json({ message: 'Survey created successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const getBaseSurveysController = async (req: Request, res: Response) => {
    try {
        const surveys = await surveyService.getBaseSurveys();
        res.status(200).json(surveys);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const getBaseSurveyByUIDController = async (req: Request, res: Response) => {
    const { uid } = req.params;
    try {
        const survey = await surveyService.getBaseSurveyByUID(Number(uid));
        res.status(200).json(survey);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const getUserSurveysController = async (req: Request, res: Response) => {
    console.log("QUE");
    const { user_id } = req.params;
    
    try {
        const surveys = await surveyService.getUserSurveys(Number(user_id));
        res.status(200).json(surveys);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const updateBaseSurveyController = async (req: Request, res: Response) => {
    const survey: BaseSurvey = req.body;
    try {
        await surveyService.updateBaseSurvey(survey);
        res.status(200).json({ message: 'Survey updated successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const deleteBaseSurveyController = async (req: Request, res: Response) => {
    const { uid } = req.params;
    try {
        await surveyService.deleteBaseSurvey(Number(uid));
        res.status(200).json({ message: 'Survey deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const getSurveyInstancesController = async (req: Request, res: Response) => {
    try {
        const surveys = await surveyService.getSurveyInstances();
        res.status(200).json(surveys);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const getSurveyInstancesByUIDController = async (req: Request, res: Response) => {
    const { uid } = req.params;
    try {
        const surveys = await surveyService.getSurveyInstancesByUID(Number(uid));
        res.status(200).json(surveys);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const createSurveyInstanceController = async (req: Request, res: Response) => {
    const { survey_uid } = req.params;
    const { team_id, category } = req.body;
    console.log(category);
    
    try {
        await surveyService.createSurveyInstance(Number(survey_uid), Number(team_id), category);
        res.status(201).json({ message: 'Survey instance created successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const deleteSurveyInstanceController = async (req: Request, res: Response) => {
    const { survey_id } = req.params;
    try {
        await surveyService.deleteSurveyInstance(Number(survey_id));
        res.status(200).json({ message: 'Survey instance deleted successfully' });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const setSurveyInstanceOpenController = async (req: Request, res: Response) => {
    const { survey_id, state } = req.body;
    try {
        await surveyService.setSurveyInstanceOpen(Number(survey_id), state);
        res.status(200).json({ message: 'Survey instance updated successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const answerSurveyController = async (req: Request, res: Response) => {
    const { user_id, survey, answers } = req.body;
    try {
        await surveyService.answerSurvey(user_id, survey, answers);
        res.status(200).json({ message: 'Survey response submitted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const removeSurveyResponseController = async (req: Request, res: Response) => {
    const { response_id } = req.params;
    try {
        await surveyService.removeSurveyResponse(Number(response_id));
        res.status(200).json({ message: 'Survey response removed successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const getSurveyResponsesByUserController = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    try {
        const responses = await surveyService.getSurveyResponsesByUser(Number(user_id));
        res.status(200).json({responses});
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const getSurveyResponsesBySurveyInstanceController = async (req: Request, res: Response) => {
    const { survey_id } = req.params;
    try {
        const responses = await surveyService.getSurveyResponsesBySurveyInstance(Number(survey_id));
        res.status(200).json({ responses });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const getSurveyResponsesByBaseSurveyController = async (req: Request, res: Response) => {
    const { survey_uid } = req.params;
    try {
        const responses = await surveyService.getSurveyResponsesByBaseSurvey(Number(survey_uid));
        res.status(200).json({responses});
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const getSurveyResponsesByTargetController = async (req: Request, res: Response) => {
    const { target_id } = req.params;
    try {
        const responses = await surveyService.getSurveyResponsesByTarget(Number(target_id));
        res.status(200).json({ responses });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}
