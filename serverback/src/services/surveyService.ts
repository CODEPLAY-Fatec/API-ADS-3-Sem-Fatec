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
    const query = `SELECT * FROM survey WHERE team_id = ?`;
    const values = [teamId];
    return db.query(query, values);
};

export const submitSurveyResponse = async (userId: string, surveyId: string, responses: any) => {
    const query = `INSERT INTO survey_responses (user_id, survey_id, responses) VALUES (?, ?, ?)`;
    const responseData = JSON.stringify(responses);
    const values = [userId, surveyId, responseData];
    return db.query(query, values);
};