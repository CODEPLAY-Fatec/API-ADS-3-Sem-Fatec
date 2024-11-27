import { answerSurvey, getBaseSurveyByUID, getSurveyResponsesBySurveyInstance, getUserSurveys } from "./surveyService";
import { db } from "../config/database2";
import { AnsweredSurvey, BaseSurvey, SurveyAnswers, SurveyInstance } from "../types/Survey";

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
        SELECT DISTINCT uid FROM survey_instance
        WHERE team_id = ?
    )
    `;

    const rows = await db.typedQuery<BaseSurvey>(query, [team_id]);

    return rows;
}

export const getUserSurveysForTeam = async (user_id: number, team_id: number) => {
    const query = `
    SELECT * FROM survey_instance
    WHERE team_id = ? AND id IN (
        SELECT survey_id FROM survey_answer
        WHERE user_id = ?
    )
    `;
    const rows = await db.typedQuery<SurveyInstance>(query, [team_id, user_id]);
    return rows;
}

export const getRelevantAnswersForBaseSurvey = async (user_id: number, team_id: number, survey_uid: number) => {
    const baseSurvey: BaseSurvey = await getBaseSurveyByUID(survey_uid) as unknown as BaseSurvey;
    const leaderRows = await db.typedQuery<{user_id: number, team_id: number}>(`SELECT * FROM team_leader WHERE team_id = ? AND user_id = ?`, [team_id, user_id])
    const groupedSurvey: SurveyAnswers = {
        BaseSurvey: baseSurvey,
        Answers: []
    }
    const isLeader = leaderRows.length > 0;
    
    // se não for membro do time?????????????????????
    // nah, eu ganharia

    const answersQuery = `
    SELECT sa.*, si.category FROM survey_answer sa
    JOIN survey_instance si ON sa.survey_id = si.id
    WHERE sa.user_id = ? AND si.uid = ? AND si.team_id = ? AND (si.category = ${isLeader ? "'Avaliação de liderado'" : "'Avaliação de líder'"} OR si.category = ${isLeader ? "'Autoavaliação de líder'" : "'Autoavaliação de liderado'"} OR si.category = 'Autoavaliação')
    `;
    
    const answerRows = await db.typedQuery<AnsweredSurvey>(answersQuery, [user_id, survey_uid, team_id]);
    groupedSurvey.Answers = answerRows;
    console.log(answersQuery, answerRows);
    
    // TODO: TEST
    // combine all of the answers into a single object

    return groupedSurvey;
}

// necessidades do dashboard:
// listar todos os times do usuário (feito)
// todas as pesquisas desse time que o usuário tem acesso 
// todas as respostas da pesquisa que o usuário selecionar