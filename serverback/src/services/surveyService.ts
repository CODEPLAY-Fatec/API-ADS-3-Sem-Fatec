import { db } from "../config/database2";
import { Survey } from "../types/Survey";

export const createSurvey = async (survey: Survey) => {
    const query = `INSERT INTO survey (team_id, uid, title, description, category, created, questions) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const questions = JSON.stringify(survey.questions);
    const values = [
        survey.team_id,
        survey.uid,
        survey.title,
        survey.description,
        survey.category,
        new Date(), // Data de criação atual
        questions,
    ];
    return db.query(query, values);
};


export const getSurveys = async (team_id: number) => {
    const query = `SELECT * FROM survey WHERE team_id = ?`;
    return db.query(query, [team_id]);
};

export const getSurvey = async (id: number) => {
    const query = `SELECT * FROM survey WHERE id = ?`;
    return db.query(query, [id]);
};

export const updateSurvey = async (id: number, survey: Survey) => {
    const query = `UPDATE survey SET uid = ?, title = ?, description = ?, category = ?, questions = ? WHERE id = ?`;
    const questions = JSON.stringify(survey.questions);
    const values = [
        survey.uid,
        survey.title,
        survey.description,
        survey.category,
        questions,
        id,
    ];
    return db.query(query, values);
};

export const deleteSurvey = async (id: number) => {
    const query = `DELETE FROM survey WHERE id = ?`;
    return db.query(query, [id]);
};

export const getSurveysByTeam = async (teamId: string) => {
    const query = `
        SELECT 
            id, 
            team_id, 
            title, 
            description, 
            category, 
            questions 
        FROM survey 
        WHERE team_id = ?;
    `;
    const values = [teamId];

    try {
        const [rows]: any[] = await db.query(query, values);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const surveys = rows.map((row: any) => {
            let questions = [];

            if (typeof row.questions === 'string') {
                try {
                    questions = JSON.parse(row.questions); 
                } catch (error) {
                    console.error('Erro ao fazer parse das questions:', error);
                }
            } else {
                questions = row.questions;
            }

            return {
                id: row.id,
                teamId: row.team_id,
                title: row.title,
                description: row.description,
                category: row.category,
                questions,
            };
        });

        return surveys;
    } catch (error: any) {
        console.error('Erro ao buscar pesquisas por time:', error);
        throw new Error('Erro ao buscar pesquisas por time');
    }
};


export const submitSurveyResponse = async (userId: string, surveyId: string, responses: any) => {
    const query = `INSERT INTO survey_answer (user_id, survey_id, created, data) VALUES (?, ?, ?, ?)`;
    const responseData = JSON.stringify(responses);
    const values = [userId, surveyId, new Date(), responseData];
    return db.query(query, values);
};
