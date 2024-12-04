import { getBaseSurveyByUID } from "./surveyService";
import { db } from "../config/database2";
import {
  AnsweredSurvey,
  BaseSurvey,
  SurveyAnswers,
  SurveyInstance,
} from "../types/Survey";
// TODO:
// adicionar respostas dedicadas à admins:
// admins podem ver todas as respostas associadas ao usuário alvo (autoavaliações preenchidas por ele e avaliações feitas sobre ele)''
export const getAllUserSurveyAnswers = async (user_id: number) => {
  const surveyAnswers = await db.typedQuery<AnsweredSurvey>(
    `SELECT * FROM survey_answer WHERE user_id = ?`,
    [user_id],
  );

  return surveyAnswers;
};

export const getAnswersTargetingUser = async (
  user_id: number,
  team_id: number,
) => {
  const rows = await db.typedQuery(
    `SELECT * FROM survey_answer WHERE target_id = ? AND team_id = ?`,
    [user_id, team_id],
  );

  return rows;
};

export const getBaseSurveysForTeam = async (
  user_id: number,
  team_id: number,
) => {
  console.log("Getting base surveys for team: ", user_id, team_id);

  // this function is supposed to:
  // from a user_id and team_id; get all the survey instances (grouped by their base surveys) that the user has access to
  // from this, we can then get the answers the user has given to these instances
  // (function getRelevantAnswersForBaseSurvey(user_id, team_id, survey_uid: number) -> AnsweredSurvey[])
  const isLeaderRows = await db.typedQuery<{
    team_id: number;
    user_id: number;
  }>(`SELECT * FROM team_leader WHERE team_id = ? AND user_id = ?`, [
    team_id,
    user_id,
  ]);

  const baseSurveysQuery = `
    SELECT * FROM base_survey
    WHERE uid IN (
        SELECT DISTINCT uid FROM survey_instance
        WHERE team_id = ?
    )
    `;

  const visibleSurveysRows = await db.typedQuery<SurveyInstance>(
    `
        SELECT si.* 
        FROM survey_instance si
        JOIN base_survey bs ON si.uid = bs.uid
        LEFT JOIN survey_answer sa ON si.id = sa.survey_id AND sa.user_id = ?
        WHERE si.team_id = ? 
        AND ( ((si.category = 'Autoavaliação' or (si.category = ? AND sa.target_id = ?))) OR si.category = ?)
    `,
    [
      user_id,
      team_id,
      isLeaderRows.length > 0
        ? "Autoavaliação de liderado"
        : "Autoavaliação de líder",
      user_id,
      isLeaderRows.length > 0 ? "Avaliação de líder" : "Avaliação de liderado",
    ],
  );
  // quais pesquisas base deveriam ser mostradas aqui?
  // autoavaliações, e:
  // pesquisas que o usuário já respondeu e AINDA TEM acesso;

  // quais RESPOSTAS deveriam ser mostradas?
  // todas as respostas de autoavaliações;
  // todas as respostas que ele já deu;
  // todas as respostas de complementos caso aplique:
  // (o usuário é líder e a pesquisa é de liderado) e a resposta é sobre o usuário atual
  // o usuário é admin e a pesquisa tem complementos ^^

  const rows = (
    await db.typedQuery<BaseSurvey>(baseSurveysQuery, [team_id])
  ).filter((survey) =>
    visibleSurveysRows.find((userSurvey) => userSurvey.uid === survey.uid),
  );

  return rows;
};

export const getUserSurveysForTeam = async (
  user_id: number,
  team_id: number,
) => {
  const query = `
    SELECT * FROM survey_instance
    WHERE team_id = ? AND id IN (
        SELECT survey_id FROM survey_answer
        WHERE user_id = ?
    )
    `;
  const rows = await db.typedQuery<SurveyInstance>(query, [team_id, user_id]);
  return rows;
};

export const getRelevantAnswersForBaseSurvey = async (
  user_id: number,
  team_id: number,
  survey_uid: number,
) => {
  const baseSurvey = (await getBaseSurveyByUID(
    survey_uid,
  ))
  const leaderRows = await db.typedQuery<{ user_id: number; team_id: number }>(
    `SELECT * FROM team_leader WHERE team_id = ? AND user_id = ?`,
    [team_id, user_id],
  );
  const groupedSurvey: SurveyAnswers = {
    BaseSurvey: baseSurvey[0],
    Answers: [],
  };
  const isLeader = leaderRows.length > 0;

  // se não for membro do time?????????????????????
  // nah, eu ganharia

  const answersQuery = `
    SELECT sa.*, si.category FROM survey_answer sa
    JOIN survey_instance si ON sa.survey_id = si.id
    WHERE sa.user_id = ? AND si.uid = ? AND si.team_id = ? AND (si.category = ${isLeader ? "'Avaliação de liderado'" : "'Avaliação de líder'"} OR si.category = ${isLeader ? "'Autoavaliação de líder'" : "'Autoavaliação de liderado'"} OR si.category = 'Autoavaliação')
    `;

  const answerRows = await db.typedQuery<AnsweredSurvey>(answersQuery, [
    user_id,
    survey_uid,
    team_id,
  ]);
  groupedSurvey.Answers = answerRows;
  console.log(answersQuery, answerRows);

  // TODO: TEST
  // combine all of the answers into a single object

  return groupedSurvey;
};

// necessidades do dashboard:
// listar todos os times do usuário (feito)
// todas as pesquisas desse time que o usuário tem acesso
// todas as respostas da pesquisa que o usuário selecionar
