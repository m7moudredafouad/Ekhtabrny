// const Group = require('../models/group')
const Quiz = require('../models/quiz')
const Member = require('../models/member')
const Answer = require('../models/answer')

exports.getMe = (req, res, next) => {
    try{
        res.render('me', {
            title: 'Profile',
            me: req.user
        })
    } catch(err){
        res.render('_404', {
            message: 'Please try again later'
        })
    }
}
exports.getMainPage = async (req, res, next) => {
    try{
        if(!req.user) {
            return res.render('login')
        }

        const myGroups = await Member.find({userId: req.user._id, role: "admin"}).limit(4).populate('groupId', 'name')
        const groups = await Member.find({userId: req.user._id, role: "member"}).limit(4).populate('groupId', 'name')
        
        res.render('index', {
            title: 'Home',
            myGroups,
            groups
        })

    } catch(err){
        next(err);
    }
}


exports.getAGroup = async (req, res, next) => {
    try{
        res.render('group', {
            title: req.group.name,
            group: req.group,
        })
    } catch(err){
        next(err);
    }
}

exports.getCreateQuiz = async (req, res, next) => {
    try{
        res.render('create quiz', {
            title: `${req.group.name} - Create Quiz`,
            group: req.group
        })
    } catch(err){
        next(err);
    }
}

exports.getAllQuizzes = async (req, res, next) => {
    try{

        const quizzes = await Quiz.find({group: req.params.groupid, owner: req.user._id});

        res.render('quizzes', {
            title: `${req.group.name} - Quizzes`,
            group: req.group,
            quizzes
        })

    } catch(err){
        next(err);
    }
}

exports.getQuiz = async (req, res, next) => {
    try{
        const answers = await Answer.find({quizId: req.quiz._id}).select('grade memberId').populate('memberId', 'name code')

        res.render('quiz', {
            title: `${req.group.name} - Quiz`,
            group: req.group,
            answers,
            questions: req.quiz.questions
        })

    } catch(err){
        res.render('_404', {
            message: 'Please try again later'
        })
    }
}

exports.getNextQuiz = async (req, res, next) => {
    try{

        res.render('nextQuiz', {
            title: `${req.group.name} - Answer Quiz`,
            group: req.group,
            quizid: req.quiz._id,
            questions: req.quiz.questions
        })

    } catch(err){
        res.render('_404', {
            message: 'Please try again later'
        })
    }
}

exports.getAllMembers = async (req, res, next) => {
    try{
        const members = await Member.find({groupId: req.params.groupid, role: {$in : ['admin', 'member']}})

        res.render('members', {
            title: `${req.group.name} - Members`,
            group: req.group,
            members
        })
    } catch(err){
        res.render('_404', {
            message: 'Please try again later'
        })
    }
}

exports.getAllPending = async (req, res, next) => {
    try{
        const members = await Member.find({groupId: req.params.groupid, role: 'pending'})

        res.render('pending', {
            title: `${req.group.name} - Pending`,
            group: req.group,
            members
        })
    } catch(err){
        res.render('_404', {
            message: 'Please try again later'
        })
    }
}