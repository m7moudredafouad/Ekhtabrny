const express = require('express')
const router = express.Router();

const {getMe, getMainPage, getAGroup, getCreateQuiz, getAllQuizzes, getQuiz, getAllMembers, getAllPending, getNextQuiz} = require('../controllers/viewsController')

const {protect, isLoggedIn} = require('../controllers/authController')
const {restrictToInGroup} = require('../controllers/groupController');
const {isCommingQuiz} = require('../controllers/quizController')
const {isQuizForTheGroup, isTheNextQuiz, findMyAnswer, beginStartQuiz} = require('../controllers/answerController')


router.get('/', isLoggedIn, getMainPage)

// Get my account
router.get('/profile', isLoggedIn, getMe)

// Group Routes
router.get('/groups/:groupid', protect, restrictToInGroup('admin', 'member'), isCommingQuiz, findMyAnswer, getAGroup)
router.get('/groups/:groupid/createquiz', protect, restrictToInGroup('admin'), getCreateQuiz)
router.get('/groups/:groupid/quizzes', protect, restrictToInGroup('admin'), getAllQuizzes)
router.get('/groups/:groupid/members', protect, restrictToInGroup('admin', 'member'), isCommingQuiz, findMyAnswer, getAllMembers)
router.get('/groups/:groupid/pending', protect, restrictToInGroup('admin'), getAllPending)

// Quiz routes
router.get('/groups/:groupid/quiz/:quizid', protect, restrictToInGroup('admin'), isQuizForTheGroup, getQuiz)
router.get('/groups/:groupid/quiz/:quizid/answer', protect, restrictToInGroup('admin', 'member'), isTheNextQuiz, findMyAnswer, beginStartQuiz, isQuizForTheGroup, getNextQuiz)

module.exports = router;