import { db } from "../config/database2";
import { Survey } from "../types/Survey";

export const createSurvey = async (survey: Survey) => {
    console.log(survey);
    
    const query = `INSERT INTO survey (team_id, data, questions) VALUES (?, ?, ?)`;
    const surveyData = JSON.stringify(survey.data);
    const questions = JSON.stringify(survey.questions);
    const values = [survey.team_id, surveyData, questions];
    console.log(survey.team_id);
    return db.query(query, values);
};

export const getSurveys = async (team_id: number) => {
    const query = `SELECT * FROM survey WHERE team_id = ?`;
    const values = [team_id];
    return db.query(query, values);
};

export const getSurvey = async (id: number) => {
    const query = `SELECT * FROM survey WHERE id = ?`;
    const values = [id];
    return db.query(query, values);
};

export const updateSurvey = async (id: number, survey: Survey) => {
    const query = `UPDATE survey SET data = ?, questions = ? WHERE id = ?`;
    const surveyData = JSON.stringify(survey.data);
    const questions = JSON.stringify(survey.questions);
    const values = [surveyData, questions, id];
    return db.query(query, values);
};

export const deleteSurvey = async (id: number) => {
    const query = `DELETE FROM survey WHERE id = ?`;
    const values = [id];
    return db.query(query, values);
};

export const getSurveysByTeam = async (teamId: string) => {
    const query = `SELECT id, team_id, 
                          JSON_UNQUOTE(JSON_EXTRACT(data, '$.title')) AS title, 
                          JSON_UNQUOTE(JSON_EXTRACT(data, '$.description')) AS description, 
                          JSON_UNQUOTE(JSON_EXTRACT(data, '$.type')) AS category, 
                          questions 
                   FROM survey 
                   WHERE team_id = ?`;
    const values = [teamId];

    try {
        const [rows]: any[] = await db.query(query, values);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const surveys = rows.map((row: any) => {
            let questions = [];
            //console.log('Row questions:', row.questions);  //console para verificar o retorno 

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
                questions
            };
        });

        return surveys;
    } catch (error: any) {
        console.error('Erro ao buscar pesquisas por time:', error);
        throw new Error('Erro ao buscar pesquisas por time');
    }
};





export const submitSurveyResponse = async (userId: string, surveyId: string, responses: any) => {
    const query = `INSERT INTO survey_answer (user_id, survey_id, data) VALUES (?, ?, ?)`;
    const responseData = JSON.stringify(responses);
    const values = [userId, surveyId, responseData];
    return db.query(query, values);
};
