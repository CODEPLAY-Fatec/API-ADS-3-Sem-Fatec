import Question from "./Question";

type SurveyData = {
  title: string
  description: string
}

export default class Survey {
    public team_id: number;
    public questions: Question[];
    public data: SurveyData; 
    constructor(team_id: number, data: SurveyData, questions: Question[]) {
      this.team_id = team_id;
      this.data = data;
      this.questions = questions;
    }
}