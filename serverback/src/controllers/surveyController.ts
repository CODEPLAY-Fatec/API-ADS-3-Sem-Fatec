import { Request, Response } from "express";
import { createSurvey, deleteSurvey, getSurvey, getSurveys, getSurveysByTeam, submitSurveyResponse, updateSurvey } from "../services/surveyService";

export const createSurveyController = async (req: Request, res: Response) => {
    const { team_id, data, questions } = req.body;
    try {
        const newSurvey = await createSurvey({ team_id, data, questions });
        res.status(201).json({ survey: newSurvey, message: 'Survey created successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        
        console.error(error);
    }
};

export const getSurveyController = async (req: Request, res: Response) => {
    const { survey_id } = req.params;
    try {
        const survey = await getSurvey(Number(survey_id));
        res.status(200).json(survey[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getSurveysController = async (req: Request, res: Response) => {
    const { team_id } = req.params;
    try {
        const surveys = await getSurveys(Number(team_id));
        res.status(200).json(surveys[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const updateSurveyController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data, questions } = req.body;
    try {
        const updatedSurvey = await updateSurvey(Number(id), {team_id: 0, data, questions})
        res.status(200).json({ survey: updatedSurvey, message: 'Survey updated successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteSurveyController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await deleteSurvey(Number(id));
        res.status(200).json({ message: 'Survey deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getSurveysByTeamController = async (req: Request, res: Response) => {
    const { teamId } = req.params;

    // Validação simples para garantir que o teamId esteja presente
    if (!teamId) {
        return res.status(400).json({ error: "Team ID is required" });
    }

    try {
        const surveys = await getSurveysByTeam(teamId);
        return res.status(200).json(surveys);
    } catch (error: any) {
        console.error("Error fetching surveys by team:", error);

        // Garante que a mensagem de erro seja uma string válida
        const errorMessage = typeof error.message === 'string' ? error.message : JSON.stringify(error);

        return res.status(500).json({ error: errorMessage });
    }
};

export const submitSurveyResponseController = async (req: Request, res: Response) => {
    const { userId, surveyId, responses } = req.body;
    try {
        await submitSurveyResponse(userId, surveyId, responses);
        res.status(201).json({ message: 'Response submitted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};