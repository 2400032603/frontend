import { Router } from 'express';
import QuizController from '../controllers/quizController';

const router = Router();
const quizController = new QuizController();

router.get('/math', quizController.getMathQuestions.bind(quizController));
router.get('/science', quizController.getScienceQuestions.bind(quizController));
router.get('/history', quizController.getHistoryQuestions.bind(quizController));
router.get('/literature', quizController.getLiteratureQuestions.bind(quizController));
router.post('/submit', quizController.submitQuiz.bind(quizController));

export default router;