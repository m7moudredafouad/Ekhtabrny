const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Quiz'
    },
    userId: {
        type:  mongoose.Schema.ObjectId,
        require: true,
        ref: 'User'
    },
    memberId: {
        type:  mongoose.Schema.ObjectId,
        require: true,
        ref: 'Member'
    },
    answers:[{
        _id: false,
        questionNumber: Number,
        answer: String,
    }],
    grade: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
})

answerSchema.index({quizId : 1, userId: 1, memberId: 1}, {unique: true});
answerSchema.index({quizId: 1, updatedAt: 1})


const Answer = new mongoose.model('Answer', answerSchema)

module.exports = Answer