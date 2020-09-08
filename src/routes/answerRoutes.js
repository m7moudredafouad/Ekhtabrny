const express = require('express')
const router = express.Router();

const {protect} = require('../controllers/authController')
const {restrictToInGroup} = require('../controllers/groupController');
const {isQuizForTheGroup, beginStartQuiz, startQuiz, endQuiz, getAllAnswersForQuiz, getAllGradesForQuiz, isTheNextQuiz} = require('../controllers/answerController')


router.use(protect)

router.get('/:groupid/quiz/:quizid/answers', restrictToInGroup('admin'), isQuizForTheGroup, getAllAnswersForQuiz)

router.get('/:groupid/quiz/:quizid/grades', restrictToInGroup('admin'), isQuizForTheGroup, getAllGradesForQuiz)

router.route('/:groupid/quiz/:quizid/answer')
    .post(restrictToInGroup('member', 'admin'), isTheNextQuiz, beginStartQuiz, startQuiz)
    .patch(restrictToInGroup('member', 'admin'), isTheNextQuiz,  endQuiz)

module.exports = router