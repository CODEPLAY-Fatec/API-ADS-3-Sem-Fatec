import { db } from "../config/database2";
import { Survey } from "../types/Survey";
import { Team } from "../types/team";

export default async function getUserSurveys(id: number): Promise<Survey[]> {
    const userLedTeams = await db.query(`SELECT * FROM team_member WHERE user_id = ${id}`) // times onde o usuário é liderado
    const userLeadsTeams = await db.query(`SELECT * FROM team_leader WHERE user_id = ${id}`) // times onde o usuário é líder
    let Surveys: Survey[] = []
    
    for (let team of userLedTeams[0] as {team_id: number, user_id: number}[]) {
        const surveys = await db.query(`SELECT * FROM survey WHERE team_id = ${team.team_id} AND (category = "Autoavaliação" OR category = "Avaliação de líder")`)
        
        for (let survey of surveys[0] as Survey[]) {
            if (survey.category == "Autoavaliação") {
                Surveys = Surveys.concat(survey)
            } else if (survey.category == "Avaliação de líder") {
                // pegar todos os líderes do time
                const teamLeaders = await db.query(`SELECT * FROM team_leader WHERE team_id = ${team.team_id}`)
                for (let teamLeader of teamLeaders[0] as { user_id: number, team_id: number}[]) {
                    // clonar pesquisa com target_id = teamLeader.user_id
                    let newSurvey = structuredClone(survey)
                    newSurvey.target_id = teamLeader.user_id
                    Surveys = Surveys.concat(newSurvey)
                }
            }
        }
    }

    for (let team of userLeadsTeams[0] as {team_id: number, user_id: number}[]) {
        const surveys = await db.query(`SELECT * FROM survey WHERE team_id = ${team.team_id} AND (category = "Autoavaliação" OR category = "Avaliação de liderado")`)
        for (let survey of surveys[0] as Survey[]) {
            if (survey.category == "Autoavaliação") {
                Surveys = Surveys.concat(survey)
            } else if (survey.category == "Avaliação de liderado") {
                // pegar todos os liderados do time
                const teamMembers = await db.query(`SELECT * FROM team_member WHERE team_id = ${team.team_id}`)
                for (let teamMember of teamMembers[0] as { user_id: number, team_id: number}[]) {
                    // clonar pesquisa com target_id = teamMember.user_id
                    let newSurvey = structuredClone(survey)
                    newSurvey.target_id = teamMember.user_id
                    Surveys = Surveys.concat(newSurvey)
                }
            }
        }
    }
    return Surveys
}
