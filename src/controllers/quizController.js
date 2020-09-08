const Quiz = require('../models/quiz')
const AppError = require('../utils/appError')
const { deleteOne} = require('./handlerFactory')

exports.isCommingQuiz = (req, res, next) => {
    let startsAt = req.group.nextquiz.startsAt;
    res.locals.quizAvailable = false;

    if(Date.parse(req.group.nextquiz.endsAt) < Date.now()){
        startsAt = false
    }

    if(Date.parse(req.group.nextquiz.startsAt) <= Date.now() && Date.parse(req.group.nextquiz.endsAt) >= Date.now()){
        res.locals.quizAvailable = true;
    }

    res.locals.startsAt = startsAt;
    next()
}


exports.getMyQuizzes = async (req, res, next) => {
    try{

        const quizzes = await Quiz.find({group: req.params.groupid, owner: req.user._id});

        res.status(200).json({
            status: 'success',
            data: quizzes
        })

    }catch(err){
        next(err);
    }
}

exports.createQuiz = async (req, res, next) => {
    try{
        
        const quiz = await Quiz.create({
            owner: req.user._id,
            group: req.params.groupid,
            questions: req.body.questions,
        });


        res.status(201).json({
            status: 'success',
            data: quiz
        })

    } catch(err){
        next(err)
    }
}

exports.updateQuiz = async (req, res, next) => {
    try{
        const quiz = await Quiz.findOneAndUpdate({_id: req.params.id, owner: req.user._id}, req.body ,{
            new: true,
            runValidators: true
        });

        if(!quiz) {
            return next(new AppError('Quiz not found', 404));
        }

        res.status(200).json({
            status: "Success",
            quiz
        })

    } catch(err){
        next(err);
    }
}

exports.addToNextQuiz = async (req, res, next) => {
    try{
        // Find the quiz to make sure of existance
        const quiz = await Quiz.findById(req.params.id);


        // Check if the quiz belongs to the group we want  or the user
        if(!quiz || quiz.group != req.params.groupid || quiz.owner != req.user.id) {
            return next(new AppError('Quiz not found', 404));
        }


        // Update the nexquiz
        const group = req.group;

        group.nextquiz.quiz = req.params.id;
        group.nextquiz.startsAt = req.body.startsAt || Date.now();
        group.nextquiz.endsAt = req.body.endsAt || (Date.now() + 60*60*1000);

        await group.save();

        res.status(200).json({
            status: "Success",
            group
        })

    } catch(err){
        next(err);
    }
}

exports.deleteQuiz = deleteOne(Quiz);