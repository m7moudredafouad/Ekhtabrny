const express = require('express')
const router = express.Router();

const {protect} = require('../controllers/authController')
const {restrictToInGroup} = require('../controllers/groupController');
const {getMyQuizzes, createQuiz, updateQuiz, deleteQuiz, addToNextQuiz} = require('../controllers/quizController')


router.use(protect)

router.route('/:groupid/quiz')
    .get(restrictToInGroup('admin'), getMyQuizzes)
    .post(restrictToInGroup('admin'), createQuiz)

router.route('/:groupid/quiz/:id')
    .patch(restrictToInGroup('admin'), updateQuiz)
    .delete(restrictToInGroup('admin'), deleteQuiz)

router.patch('/:groupid/quiz/:id/next', restrictToInGroup('admin'), addToNextQuiz)

module.exports = router;