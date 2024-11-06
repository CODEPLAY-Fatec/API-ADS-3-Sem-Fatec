import { Request, Response } from "express";
import { createBaseSurvey, createSurveyInstance, deleteBaseSurvey, deleteSurveyInstance, getBaseSurveyByUID, getBaseSurveys, getSurveyInstances, getSurveyInstancesByUID, getUserSurveys, setSurveyInstanceOpen, updateBaseSurvey } from "../services/surveyService";
import { BaseSurvey } from "../types/Survey";

export const createBaseSurveyController = async (req: Request, res: Response) => {
    const survey: BaseSurvey = req.body.survey;
    const open: boolean = req.body.open;
    try {
        await createBaseSurvey(survey, open);
        res.status(201).json({ message: 'Survey created successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        throw error;
    }
}

export const getBaseSurveysController = async (req: Request, res: Response) => {
    try {
        const surveys = await getBaseSurveys();
        res.status(200).json(surveys);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getBaseSurveyByUIDController = async (req: Request, res: Response) => {
    const { uid } = req.params;
    try {
        const survey = await getBaseSurveyByUID(Number(uid));
        res.status(200).json(survey);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getUserSurveysController = async (req: Request, res: Response) => {
    console.log("QUE");
    const { user_id } = req.params;
    
    try {
        const surveys = await getUserSurveys(Number(user_id));
        res.status(200).json(surveys);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const updateBaseSurveyController = async (req: Request, res: Response) => {
    const survey: BaseSurvey = req.body;
    try {
        await updateBaseSurvey(survey);
        res.status(200).json({ message: 'Survey updated successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteBaseSurveyController = async (req: Request, res: Response) => {
    const { uid } = req.params;
    try {
        await deleteBaseSurvey(Number(uid));
        res.status(200).json({ message: 'Survey deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getSurveyInstancesController = async (req: Request, res: Response) => {
    try {
        const surveys = await getSurveyInstances();
        res.status(200).json(surveys);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getSurveyInstancesByUIDController = async (req: Request, res: Response) => {
    const { uid } = req.params;
    try {
        const surveys = await getSurveyInstancesByUID(Number(uid));
        res.status(200).json(surveys);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const createSurveyInstanceController = async (req: Request, res: Response) => {
    const { survey_uid } = req.params;
    try {
        await createSurveyInstance(Number(survey_uid));
        res.status(201).json({ message: 'Survey instance created successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteSurveyInstanceController = async (req: Request, res: Response) => {
    const { survey_id } = req.params;
    try {
        await deleteSurveyInstance(Number(survey_id));
        res.status(200).json({ message: 'Survey instance deleted successfully' });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const setSurveyInstanceOpenController = async (req: Request, res: Response) => {
    const { survey_id, state } = req.body;
    try {
        await setSurveyInstanceOpen(Number(survey_id), state);
        res.status(200).json({ message: 'Survey instance updated successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
