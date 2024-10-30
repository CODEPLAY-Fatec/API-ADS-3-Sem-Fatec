import { Request, Response } from "express";
import { createSurvey, deleteSurvey, getSurvey, getSurveys, getSurveysByTeam, submitSurveyResponse, updateSurvey } from "../services/surveyService";
import { Survey } from "../types/Survey";

// Criação de uma nova pesquisa
export const createSurveyController = async (req: Request, res: Response) => {
    const { team_id, title, description, category, questions } = req.body;

    const newSurvey: Survey = {
        team_id,
        uid: Date.now().toString(), // date.now gera um numero aleatorio com base em no tempo desde 1970, mas da pra alterar o tipo de geraçao
        title,
        description,
        category,
        created: new Date(),
        questions
    };

    try {
        const survey = await createSurvey(newSurvey);
        res.status(201).json({ survey, message: 'Survey created successfully' });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// Obter uma pesquisa específica
export const getSurveyController = async (req: Request, res: Response) => {
    const { survey_id } = req.params;
    try {
        const survey = await getSurvey(Number(survey_id));
        res.status(200).json(survey[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Obter todas as pesquisas de um time específico
export const getSurveysController = async (req: Request, res: Response) => {
    const { team_id } = req.params;
    try {
        const surveys = await getSurveys(Number(team_id));
        res.status(200).json(surveys[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Atualizar uma pesquisa
export const updateSurveyController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { uid, title, description, category, questions } = req.body;

    const updatedSurvey: Survey = {
        team_id: 0, // Placeholder;
        uid,
        title,
        description,
        category,
        created: new Date(), 
        questions
    };

    try {
        const survey = await updateSurvey(Number(id), updatedSurvey);
        res.status(200).json({ survey, message: 'Survey updated successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Deletar uma pesquisa
export const deleteSurveyController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await deleteSurvey(Number(id));
        res.status(200).json({ message: 'Survey deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Obter pesquisas de um time específico
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


// Submeter uma resposta de pesquisa
export const submitSurveyResponseController = async (req: Request, res: Response) => {
    const { userId, surveyId, responses } = req.body;

    try {
        await submitSurveyResponse(userId, surveyId, responses);
        res.status(201).json({ message: 'Response submitted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
