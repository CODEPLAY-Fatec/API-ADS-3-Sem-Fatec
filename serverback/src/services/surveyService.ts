import Survey from "../classes/Survey";
import { db } from "../config/database2";

export const createSurvey = async (survey: Survey) => {
    const query = `INSERT INTO survey (team_id, data, questions) VALUES (?, ?, ?)`;
    const surveyData = JSON.stringify(survey.data);
    const questions = JSON.stringify(survey.questions);
    const values = [survey.team_id, surveyData, questions];
    return db.query(query, values);
}

export const getSurveys = async (team_id: number) => {
    const query = `SELECT * FROM survey WHERE team_id = ?`;
    const values = [team_id];
    return db.query(query, values);
}

export const getSurvey = async (id: number) => {
    const query = `SELECT * FROM survey WHERE id = ?`;
    const values = [id];
    return db.query(query, values);
}

export const updateSurvey = async (id: number, survey: Survey) => {
    const query = `UPDATE survey SET data = ?, questions = ? WHERE id = ?`;
    const surveyData = JSON.stringify(survey.data);
    const questions = JSON.stringify(survey.questions);
    const values = [surveyData, questions, id];
    return db.query(query, values);
}

export const deleteSurvey = async (id: number) => {
    const query = `DELETE FROM survey WHERE id = ?`;
    const values = [id];
    return db.query(query, values);
}