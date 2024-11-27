import { getBaseSurveyByUID, getSurveyResponsesBySurveyInstance, getUserSurveys } from "./surveyService";
import { db } from "../config/database2";
import { BaseSurvey } from "../types/Survey";

export const getAllUserSurveyAnswers = async (user_id: number) => {
    const userSurveys = await getUserSurveys(user_id);
    const surveyAnswers = [];

    for (const survey of userSurveys) {
        const answers = await getSurveyResponsesBySurveyInstance(survey.survey_id);
        surveyAnswers.push({
            survey,
            answers
        });
    }

    return surveyAnswers;
};

export const getBaseSurveysForTeam = async (user_id: number, team_id: number) => {
    // this function is supposed to:
    // from a user_id and team_id; get all the survey instances (grouped by their base surveys) that the user has access to
    // from this, we can then get the answers the user has given to these instances
    // (function getRelevantAnswersForBaseSurvey(user_id, team_id, survey_uid: number) -> AnsweredSurvey[])
    const query = `
    SELECT * FROM base_survey
    WHERE id IN (
        SELECT survey_id FROM survey_instances
        WHERE team_id = ?
    )
    `;
    let rows = await db.query(query, [team_id]) as unknown as BaseSurvey[];;

    // remove surveys that the user doesn't have access to
    // if the user is a leader for this team, remove surveys that are not for leaders
    // if the user is a member for this team, remove surveys that are not for members
    const isLeaderQuery = `
        SELECT * FROM team_leader
        WHERE team_id = ? AND user_id = ?
    `;
    let leaderRows = await db.query(isLeaderQuery, [team_id, user_id]) as unknown as {team_id: number, user_id: number}[];

    const isMemberQuery = `
        SELECT * FROM team_member
        WHERE team_id = ? AND user_id = ?
    `;
    let memberRows = await db.query(isMemberQuery, [team_id, user_id]) as unknown as {team_id: number, user_id: number}[];;
    // TODO: correlate the user's answers 
    

    return rows;
}

export const getUserSurveysForTeam = async (user_id: number, team_id: number) => {
    const query = `
    SELECT * FROM survey_instance
    WHERE team_id = ? AND id IN (
        SELECT survey_id FROM survey_answers
        WHERE user_id = ?
    )
    `;
    const [rows] = await db.query(query, [team_id, user_id]);
    return rows;
}

export const getAnswersForBaseSurvey = async (user_id: number, survey_uid: number, team_id: number) => {
    const baseSurvey: BaseSurvey = await getBaseSurveyByUID(survey_uid) as unknown as BaseSurvey;
    const query = `
    SELECT * FROM survey_answers
    WHERE user_id = ? AND survey_id IN (
        SELECT id FROM survey_instances
        WHERE uid = ? AND team_id = ?
    )
    `;
    const [rows] = await db.query(query, [user_id, survey_uid, team_id]);

    // combine all of the answers into a single object
    
    return rows;
}

// necessidades do dashboard:
// listar todos os times do usuário (feito)
// todas as pesquisas desse time que o usuário tem acesso 
// todas as respostas da pesquisa que o usuário selecionar