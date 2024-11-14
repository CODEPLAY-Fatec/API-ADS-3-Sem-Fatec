import { Request, Response } from "express";
import { answerSurvey, createBaseSurvey, createSurveyInstance, deleteBaseSurvey, deleteSurveyInstance, getBaseSurveyByUID, getBaseSurveys, getSurveyInstances, getSurveyInstancesByUID, getSurveyResponsesByBaseSurvey, getSurveyResponsesBySurveyInstance, getSurveyResponsesByTarget, getSurveyResponsesByUser, getUserSurveys, removeSurveyResponse, setSurveyInstanceOpen, submitSurveyResponse, updateBaseSurvey } from "../services/surveyService";
import { BaseSurvey } from "../types/Survey";

export const createBaseSurveyController = async (req: Request, res: Response) => {
    const survey: BaseSurvey = req.body.survey;
    const open: boolean = req.body.open;
    const teams: [] = req.body.teams
    try {
        await createBaseSurvey(survey, open,teams);
        res.status(201).json({ message: 'Survey created successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const getBaseSurveysController = async (req: Request, res: Response) => {
    try {
        const surveys = await getBaseSurveys();
        res.status(200).json(surveys);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const getBaseSurveyByUIDController = async (req: Request, res: Response) => {
    const { uid } = req.params;
    try {
        const survey = await getBaseSurveyByUID(Number(uid));
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
        const surveys = await getUserSurveys(Number(user_id));
        res.status(200).json(surveys);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const updateBaseSurveyController = async (req: Request, res: Response) => {
    const survey: BaseSurvey = req.body;
    try {
        await updateBaseSurvey(survey);
        res.status(200).json({ message: 'Survey updated successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const deleteBaseSurveyController = async (req: Request, res: Response) => {
    const { uid } = req.params;
    try {
        await deleteBaseSurvey(Number(uid));
        res.status(200).json({ message: 'Survey deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const getSurveyInstancesController = async (req: Request, res: Response) => {
    try {
        const surveys = await getSurveyInstances();
        res.status(200).json(surveys);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const getSurveyInstancesByUIDController = async (req: Request, res: Response) => {
    const { uid } = req.params;
    try {
        const surveys = await getSurveyInstancesByUID(Number(uid));
        res.status(200).json(surveys);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const createSurveyInstanceController = async (req: Request, res: Response) => {
    const { survey_uid } = req.params;
    const { team_id } = req.body;
    try {
        await createSurveyInstance(Number(survey_uid), Number(team_id));
        res.status(201).json({ message: 'Survey instance created successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
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
        console.error(error);
    }
}

export const setSurveyInstanceOpenController = async (req: Request, res: Response) => {
    const { survey_id, state } = req.body;
    try {
        await setSurveyInstanceOpen(Number(survey_id), state);
        res.status(200).json({ message: 'Survey instance updated successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const answerSurveyController = async (req: Request, res: Response) => {
    const { user_id, survey, answers } = req.body;
    try {
        await answerSurvey(user_id, survey, answers);
        res.status(200).json({ message: 'Survey response submitted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const removeSurveyResponseController = async (req: Request, res: Response) => {
    const { response_id } = req.params;
    try {
        await removeSurveyResponse(Number(response_id));
        res.status(200).json({ message: 'Survey response removed successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const getSurveyResponsesByUserController = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    try {
        const responses = await getSurveyResponsesByUser(Number(user_id));
        res.status(200).json({responses});
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const getSurveyResponsesBySurveyInstanceController = async (req: Request, res: Response) => {
    const { survey_id } = req.params;
    try {
        const responses = await getSurveyResponsesBySurveyInstance(Number(survey_id));
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
        const responses = await getSurveyResponsesByBaseSurvey(Number(survey_uid));
        res.status(200).json({responses});
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

export const getSurveyResponsesByTargetController = async (req: Request, res: Response) => {
    const { target_id } = req.params;
    try {
        const responses = await getSurveyResponsesByTarget(Number(target_id));
        res.status(200).json({ responses });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}