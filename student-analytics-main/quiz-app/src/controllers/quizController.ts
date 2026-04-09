export class QuizController {
    private quizzes: { [key: string]: any[] };

    constructor() {
        this.quizzes = {
            math: require('../quizzes/math').default,
            science: require('../quizzes/science').default,
            history: require('../quizzes/history').default,
            literature: require('../quizzes/literature').default,
        };
    }

    public getQuestions(subject: string) {
        return this.quizzes[subject] || [];
    }

    public submitAnswers(subject: string, answers: { [key: number]: string }) {
        const questions = this.getQuestions(subject);
        let score = 0;

        questions.forEach((question, index) => {
            if (question.correctAnswer === answers[index]) {
                score++;
            }
        });

        return {
            score,
            total: questions.length,
            percentage: (score / questions.length) * 100,
        };
    }
}