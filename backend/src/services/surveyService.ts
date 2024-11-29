import { QueryResult, ResultSetHeader } from "mysql2";
import { db } from "../config/database2";
import { Question } from "../types/Question";
import { AnsweredSurvey, BaseSurvey, SurveyCategory, SurveyInstance, UsableSurvey } from "../types/Survey";

export const createBaseSurvey = async (survey: BaseSurvey, open: boolean, teams?: number[], category?: SurveyCategory, auxiliarySurvey?: boolean) => {
    const query = `INSERT INTO base_survey (title, description, questions) VALUES (?, ?, ?)`;
    const questions = JSON.stringify(survey.questions);
    const values = [
        survey.title,
        survey.description, 
        questions,
    ];
    const result = await db.query(query, values);
    const uid: ResultSetHeader = result[0] as unknown as ResultSetHeader;
    if (open && teams && category) {
        for (const team of teams) {
            await createSurveyInstance(uid.insertId, team, category);
            if (auxiliarySurvey) {
                await createSurveyInstance(uid.insertId, team, category == SurveyCategory["Avaliação de líder"] ? SurveyCategory["Autoavaliação de líder"] : SurveyCategory["Autoavaliação de liderado"]);
            }
        }
    }
};

export const getBaseSurveys = async () => {
    const query = `
        SELECT bs.*, si.category as last_category
        FROM base_survey bs
        LEFT JOIN survey_instance si ON bs.uid = si.uid
        WHERE si.id = (
            SELECT MAX(id)
            FROM survey_instance
        WHERE uid = bs.uid
        )
    `;
    const [rows] = await db.query(query);
    return rows;
}

export const getBaseSurveyByUID = async (uid: number) => {
    const query = `SELECT * FROM base_survey WHERE uid = ?`;
    return db.typedQuery<BaseSurvey>(query, [uid]);    
} //no caso se nao retonrar assim da problema na criaçao da instancia q utiliza essa funçao

export const updateBaseSurvey = async (survey: BaseSurvey) => {
    const query = `UPDATE base_survey SET team_id = ?, title = ?, description = ?, questions = ? WHERE uid = ?`;
    const questions = JSON.stringify(survey.questions);
    const values = [
        survey.title,
        survey.description,
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
    const query = `
        SELECT si.*, t.name as team_name
        FROM survey_instance si
        JOIN team t ON si.team_id = t.id
        WHERE si.uid = ?
    `;
    return await db.typedQuery<SurveyInstance>(query, [uid]);
}

export const createSurveyInstance = async (survey_uid: number, team_id: number, category: SurveyCategory) => {
    try {
        console.log(team_id)
        console.log(survey_uid)
        // Primeiro, verifica se já existe uma instância com esse uid e team_id
        const checkQuery = `SELECT id FROM survey_instance WHERE uid = ? AND team_id = ? AND category = ?`;
        const [existingInstance]: any[] = await db.query(checkQuery, [survey_uid, team_id, category]);

        // Se a instância existe, exclui-a antes de criar uma nova
        if (existingInstance.length > 0) {
            await setSurveyInstanceOpen(existingInstance[0].id, 0);
        }

        // Cria uma nova instância
        const insertQuery = `INSERT INTO survey_instance (uid, created, open, team_id, category) VALUES (?, ?, 1, ?, ?)`;
        console.log(survey_uid)
        const baseSurvey: BaseSurvey = await getBaseSurveyByUID(survey_uid).then((result) => result[0]);
        console.log(baseSurvey)
        await db.query(insertQuery, [baseSurvey.uid, new Date(), team_id, category]);

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
    return db.typedQuery<SurveyInstance>(query);
}

export const getSurveyInstancesByTeam = async (teamId: number) => {
    const query = `SELECT * FROM survey_instance WHERE team_id = ?`;
    return db.typedQuery<SurveyInstance>(query, [teamId]);
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
export async function getUserSurveys(user_id: number, open: boolean = true): Promise<UsableSurvey[]> {
    // console.log("--------------------------------");
    
    const userLedTeams = await db.typedQuery<{team_id: number, user_id: number}>(`SELECT * FROM team_member WHERE user_id = ?`, [user_id]) // times onde o usuário é liderado
    const userLeadsTeams = await db.typedQuery<{team_id: number, user_id: number}>(`SELECT * FROM team_leader WHERE user_id = ?`, [user_id]) // times onde o usuário é líder

    let Surveys: UsableSurvey[] = []
    const BaseSurveys: { [key: string]: BaseSurvey } = {};
    
    async function AddSurveys(Scope: {team_id: number, user_id: number}[], Category: SurveyCategory): Promise<void> {
        const Complement: SurveyCategory = Category == SurveyCategory["Avaliação de líder"] ? SurveyCategory["Autoavaliação de liderado"] : SurveyCategory["Autoavaliação de líder"];
        // buscando avaliações de líder, pode-se deduzir que o usuário é um liderado, portanto, o complemento deve ser autoavaliação de liderado.        
        for (let team of Scope) {
            const surveys: SurveyInstance[] = await db.typedQuery<SurveyInstance>(`
                SELECT si.* 
                FROM survey_instance si
                JOIN base_survey bs ON si.uid = bs.uid
                LEFT JOIN survey_answer sa ON si.id = sa.survey_id AND sa.user_id = ?
                WHERE si.team_id = ? ${open ? "AND si.open = 1" : ""}
                AND ( (si.category = 'Autoavaliação' or si.category = ? AND sa.user_id IS NULL) OR si.category = ?)
            `, 
            // uid, teamid, open, complement, category
                // novo:
                // a pesquisa é autoavaliativa e não tem resposta OU
                // a pesquisa é da categoria desejada
                // arglist:
                // user_id, team_id, Complement, Category

                // a pesquisa não é autoavaliativa ou tem resposta E
                // pesquisas autoavaliativas podem ter apenas uma resposta.
                // pesquisas não autoavaliativas podem ter várias respostas (para diferentes alvos apenas)

            [user_id, team.team_id, Complement, Category]);
                        // isso aqui é macumba.
            
            for (let survey of surveys) {
                let BaseSurvey = BaseSurveys[survey.uid]
                if (!BaseSurvey) {
                    const baseSurveyResult = await getBaseSurveyByUID(survey.uid).then((result) => result[0]);
                    BaseSurvey = baseSurveyResult
                    BaseSurveys[survey.uid] = baseSurveyResult;
                }
                
                let UsableSurvey: UsableSurvey
                if (!BaseSurvey) continue;
                console.log(survey.category); 
                if (survey.category == "Autoavaliação" || survey.category == Complement) {
                    UsableSurvey = {
                        survey_id: survey.id,
                        title: BaseSurvey.title,
                        description: BaseSurvey.description,
                        category: survey.category,
                        questions: BaseSurvey.questions,
                        team_id: survey.team_id,
                        uid : BaseSurvey.uid
                    }
                    Surveys.push(UsableSurvey)
                    
                } else if (survey.category == Category) {
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
                        // console.log(teamMember);
                        UsableSurvey = {
                            survey_id: survey.id,
                            title: BaseSurvey.title,
                            description: BaseSurvey.description,
                            category: survey.category,
                            questions: BaseSurvey.questions,
                            target_id: teamMember.user_id,
                            target_name: teamMember.name, // Inclui o nome do usuário
                            team_id: survey.team_id,
                            uid: BaseSurvey.uid
                        }
                        Surveys.push(UsableSurvey)
                    }
                }
            }
        }
    }
    await AddSurveys(userLedTeams, SurveyCategory["Avaliação de líder"])
    await AddSurveys(userLeadsTeams, SurveyCategory["Avaliação de liderado"])
    // eu odeio esse código
    // console.log("--------------------------------");
    // console.log(Surveys);
    
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
    return db.typedQuery<AnsweredSurvey>(query, [user_id]);
};

export const getSurveyResponsesBySurveyInstance = async (survey_id: number) => {
    const query = `SELECT * FROM survey_answer WHERE survey_id = ?`;
    return db.typedQuery<AnsweredSurvey>(query, [survey_id]);
}

export const getSurveyResponsesByBaseSurvey = async (survey_uid: number) => {
    const query = `SELECT * FROM survey_answer WHERE survey_uid = ?`;
    return db.typedQuery<AnsweredSurvey>(query, [survey_uid]);
}

export const getSurveyResponsesByTarget = async (target_id: number) => {
    const query = `SELECT * FROM survey_answer WHERE target_id = ?`;
    return db.typedQuery<AnsweredSurvey>(query, [target_id]);
    
}
