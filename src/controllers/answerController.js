const Answer = require('../models/answer')
const Member = require('../models/member')
const Quiz = require('../models/quiz')
const AppError = require('../utils/appError')

exports.isQuizForTheGroup = async (req, res, next) => {
    const quiz = await Quiz.findOne({_id: req.params.quizid, group: req.params.groupid})
    if(!quiz){
        return next(new AppError("Quiz not found" ,404))
    }
    req.quiz = quiz
    next();
}

exports.isTheNextQuiz = (req, res, next) => {
    // Is this in the next quiz
    if(req.group.nextquiz.quiz != req.params.quizid){
        return next(new AppError("Quiz not found" ,404))
    }

    // Check the time of sending answer

    //console.log(Date.now())
    //console.log(Date.parse(req.group.nextquiz.startsAt))
    if(Date.parse(req.group.nextquiz.startsAt) > Date.now()){
        return next(new AppError("The quiz doesn\'t exist" ,404))
    } else if(Date.parse(req.group.nextquiz.endsAt) < Date.now()) {
        return next(new AppError("The quiz has ended you can't send your answer" ,404))
    }

    next();
}

exports.findMyAnswer = async (req, res, next) => {
    const quizId = req.params.quizid || req.group.nextquiz.quiz
    const ans = await  Answer.findOne({quizId, userId: req.user._id})
    
    res.locals.empty = true;

    if(!ans){ return next() }

    req.answer = ans

    if(!ans.$isEmpty('answers')){
        res.locals.empty = false;
        res.locals.grade = ans.grade;
    }
    return next()
}

exports.beginStartQuiz = async (req, res, next) => {
    if(req.answer) { return next();}

    const member = await Member.findOne({groupId: req.params.groupid, userId: req.user._id}).select("_id")

    const answer = await Answer.create({
        quizId: req.params.quizid,
        userId: req.user._id,
        memberId: member._id
    })
    req.answer = answer
    next()
}

exports.startQuiz = async (req, res, next) => {
    try{
        res.status(200).json({
            status: "Success",
            answer: req.answer
        })

    } catch(err){
        next(err);
    }
}

exports.endQuiz = async (req, res, next) => {
    try{
        const quiz = await Quiz.findById(req.params.quizid);
        let answer = await Answer.findOne({quizId: req.params.quizid, userId: req.user.id});

        if(!answer){
            return next(new AppError("There is an error" ,404))
        }

        if(answer.$isEmpty('answers')){
            let grade = 0;
            for(let i = 0; i < req.body.answers.length; i++){
                let x = quiz.questions.findIndex((q) => {
                    return q.number == req.body.answers[i].questionNumber && q.solution == req.body.answers[i].answer
                })

                grade += (x == -1 ? 0 : 1);
            }

            answer.answers = req.body.answers;
            answer.grade = grade;
            await answer.save();

        }

        res.status(200).json({
            status: "Success",
            answer
        })

    } catch(err){
        next(err);
    }
}

exports.getAllGradesForQuiz = async (req, res, next) => {
    try{

        const answers = await Answer.find({quizId: req.params.quizid}).select('userId memberId grade').populate('memberId', 'name code');


        res.status(200).json({
            status: "Success",
            answers,
        })

    } catch(err){
        next(err);
    }
}

exports.getAllAnswersForQuiz = async (req, res, next) => {
    try{

        const answers = await Answer.find({quizId: req.params.quizid});

        res.status(200).json({
            status: "Success",
            answers
        })

    } catch(err){
        next(err);
    }
}