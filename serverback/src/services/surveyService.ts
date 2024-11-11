import { QueryResult, ResultSetHeader } from "mysql2";
import { db } from "../config/database2";
import Question from "../types/Question";
import { BaseSurvey, SurveyInstance, UsableSurvey } from "../types/Survey";

export const createBaseSurvey = async (survey: BaseSurvey, open: boolean, teams?: number[]) => {
    const query = `INSERT INTO base_survey (title, description, category, questions) VALUES (?, ?, ?, ?)`;
    const questions = JSON.stringify(survey.questions);
    const values = [
        survey.title,
        survey.description,
        survey.category,
        questions,
    ];
    const result = await db.query(query, values);
    const uid: ResultSetHeader = result[0] as unknown as ResultSetHeader;
    if (open && teams) {
        for (const team of teams) {
            await createSurveyInstance(uid.insertId, team);
        }
    }
};

export const getBaseSurveys = async () => {
    const query = `SELECT * FROM base_survey`;
    const [rows] = await db.query(query);
    return rows;
}

export const getBaseSurveyByUID = async (uid: number) => {
    const query = `SELECT * FROM base_survey WHERE uid = ?`;
    const[rows]= await db.query(query, [uid]);
    return rows;
}

export const updateBaseSurvey = async (survey: BaseSurvey) => {
    const query = `UPDATE base_survey SET team_id = ?, title = ?, description = ?, category = ?, questions = ? WHERE uid = ?`;
    const questions = JSON.stringify(survey.questions);
    const values = [
        survey.title,
        survey.description,
        survey.category,
        questions,
        survey.uid,
    ];
    return db.query(query, values);
}

export const deleteBaseSurvey = async (uid: number) => {
    const query = `DELETE FROM base_survey WHERE uid = ?`;
    return db.query(query, [uid]);
}

export const getSurveyInstancesByUID = async (uid: number) => {
    const query = `SELECT * FROM survey_instance WHERE uid = ?`;
    const [rows] =  await db.query(query, [uid]);
    return rows
}

export const createSurveyInstance = async (survey_uid: number, team_id: number) => {
    try {
        console.log(team_id)
        console.log(survey_uid)
        // Primeiro, verifica se já existe uma instância com esse uid e team_id
        const checkQuery = `SELECT id FROM survey_instance WHERE uid = ? AND team_id = ?`;
        const [existingInstance]: any[] = await db.query(checkQuery, [survey_uid, team_id]);

        // Se a instância existe, exclui-a antes de criar uma nova
        if (existingInstance.length > 0) {
            await setSurveyInstanceOpen(existingInstance[0].id, 0);
        }

        // Cria uma nova instância
        const insertQuery = `INSERT INTO survey_instance (uid, created, open, team_id) VALUES (?, ?, 1, ?)`;
        const baseSurvey: BaseSurvey = await getBaseSurveyByUID(survey_uid).then((result: any) => result[0][0]);
        await db.query(insertQuery, [baseSurvey.uid, new Date(), team_id]);

        return { message: "Instância de pesquisa criada com sucesso." };
    } catch (error) {
        console.error("Erro ao criar ou recriar instância da pesquisa:", error);
        throw error;
    }
};

export const deleteSurveyInstance = async (survey_id: number) => {
    const query = `DELETE FROM survey_instance WHERE id = ?`;
    return db.query(query, [survey_id]);
}

export const setSurveyInstanceOpen = async (survey_id: number, state: number) => {
    const query = `UPDATE survey_instance SET open = ? WHERE id = ?`;
    return db.query(query, [state, survey_id]);
}

export const getSurveyInstances = async () => {
    const query = `SELECT * FROM survey_instance`;
    const[rows] = await db.query(query);
    return rows;
}

export const getSurveyInstancesByTeam = async (teamId: number) => {
    const query = `SELECT * FROM survey_instance WHERE team_id = ?`;
    const [rows] = await db.query(query, [teamId]);
    return rows;
}

export const submitSurveyResponse = async (user_id: number, survey_id: number, survey_uid: number, data: Question[], target_id?: number) => {
    const query = `INSERT INTO survey_response (user_id, survey_id, survey_uid, data, target_id) VALUES (?, ?, ?, ?, ?)`;
    const values = [
        user_id,
        survey_id,
        survey_uid,
        JSON.stringify(data),
        target_id,
    ];
    return db.query(query, values);
}
// pegar as pesquisas disponíveis de um usuário
export async function getUserSurveys(user_id: number): Promise<UsableSurvey[]> {
    const userLedTeams = await db.query(`SELECT * FROM team_member WHERE user_id = ?`, [user_id]); // times onde o usuário é liderado
    const userLeadsTeams = await db.query(`SELECT * FROM team_leader WHERE user_id = ?`, [user_id]); // times onde o usuário é líder

    let Surveys: UsableSurvey[] = []
    const BaseSurveys: { [key: string]: BaseSurvey } = {};
    
    async function AddSurveys(Scope: QueryResult, Category: "Avaliação de líder" | "Avaliação de liderado"): Promise<void> {
        
        for (let team of Scope as {team_id: number, user_id: number}[]) {
            const surveys = await db.query(`
                SELECT si.* 
                FROM survey_instance si
                JOIN base_survey bs ON si.uid = bs.uid
                LEFT JOIN survey_answer sa ON si.id = sa.survey_id AND sa.user_id = ?
                WHERE si.team_id = ? 
                  AND (bs.category != 'Autoavaliação' OR sa.user_id IS NULL)
                  AND (bs.category = 'Autoavaliação' OR bs.category = ?)
            `, [user_id, team.team_id, Category]);
                        // isso aqui é macumba.
            for (let survey of surveys[0] as SurveyInstance[]) {
                let BaseSurvey = BaseSurveys[survey.uid]
                if (!BaseSurvey) {
                    const baseSurveyResult = await getBaseSurveyByUID(survey.uid);
                    BaseSurvey = (baseSurveyResult as unknown as [BaseSurvey[]])[0][0];
                    BaseSurveys[survey.uid] = BaseSurvey;
                    //                      meu deus.
                }
                
                let UsableSurvey: UsableSurvey
                if (!BaseSurvey) continue;
                
                if (BaseSurvey.category == "Autoavaliação") {
                    UsableSurvey = {
                        survey_id: survey.id,
                        title: BaseSurvey.title,
                        description: BaseSurvey.description,
                        category: BaseSurvey.category,
                        questions: BaseSurvey.questions,
                        team_id: survey.team_id,
                        uid : BaseSurvey.uid
                    }
                    Surveys.push(UsableSurvey)
                    
                } else if (BaseSurvey.category == Category) {
                    // pegar todos os membros do time que não tenham respostas associadas à eles
                    const teamRelations = await db.query(`
                        SELECT tm.user_id, u.name 
                        FROM ${Category == "Avaliação de liderado" ? "team_member" : "team_leader"} tm
                        JOIN users u ON tm.user_id = u.id
                        LEFT JOIN survey_answer sa ON tm.user_id = sa.target_id 
                                                   AND sa.user_id = ? 
                                                   AND sa.survey_id = ?
                        WHERE tm.team_id = ? AND sa.survey_id IS NULL
                    `, [user_id, survey.id, team.team_id]);
                    
                    
                        // ISSO AQUI É MALIGNO MACUMBA MACUMBA MACUMBA MACUMBA MACUMBA MACUMBA MACUMBA 
                    for (let teamMember of teamRelations[0] as { user_id: number, team_id: number, name: string }[]) {
                        // clonar pesquisa com target_id = teamMember.user_id
                        console.log(teamMember);
                        UsableSurvey = {
                            survey_id: survey.id,
                            title: BaseSurvey.title,
                            description: BaseSurvey.description,
                            category: BaseSurvey.category,
                            questions: BaseSurvey.questions,
                            target_id: teamMember.user_id,
                            target_name: teamMember.name, // Inclui o nome do usuário
                            team_id: survey.team_id,
                            uid : BaseSurvey.uid
                        }
                        Surveys.push(UsableSurvey)
                    }
                }
            }
        }
    }
    await AddSurveys(userLedTeams[0], "Avaliação de líder")
    await AddSurveys(userLeadsTeams[0], "Avaliação de liderado")
    // eu odeio esse código
    
    
    return Surveys
}

export const answerSurvey = async (user_id: number, survey: UsableSurvey, answers: Question[]) => {
    // TODO: check if user can answer survey
    const survey_uid = db.query(`SELECT uid FROM survey_instance WHERE id = ?`, [survey.survey_id]).then((result: any) => result[0][0].uid);

    const query = `INSERT INTO survey_answer (user_id, survey_id, survey_uid, created, data, target_id) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
        user_id,
        survey.survey_id,
        survey.uid,
        new Date(),
        JSON.stringify(answers),
        survey.target_id ?? null,
    ];
    console.log(values)

    return db.query(query, values);
}

export const removeSurveyResponse = async (response_id: number) => {
    const query = `DELETE FROM survey_answer WHERE answer_id = ?`;
    return db.query(query, [response_id]);
}

export const getSurveyResponsesByUser = async (user_id: number) => {
    const query = `SELECT * FROM survey_answer WHERE user_id = ?`;
    const [rows] = await db.query(query, [user_id]);
    return rows;
};

export const getSurveyResponsesBySurveyInstance = async (survey_id: number) => {
    const query = `SELECT * FROM survey_answer WHERE survey_id = ?`;
    const [rows]= await db.query(query, [survey_id]);
    return rows
}

export const getSurveyResponsesByBaseSurvey = async (survey_uid: number) => {
    const query = `SELECT * FROM survey_answer WHERE survey_uid = ?`;
    const [rows] = await db.query(query, [survey_uid]);
    return rows
}

export const getSurveyResponsesByTarget = async (target_id: number) => {
    const query = `SELECT * FROM survey_answer WHERE target_id = ?`;
    const [rows]= await db.query(query, [target_id]);
    return rows
    
}
