export default class Question {
    public question: string;
    public type: string;
    public options: string[];
  
    constructor(question: string, type: string, options: string[]) {
      this.question = question;
      this.type = type;
      this.options = options;
    }
}