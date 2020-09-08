const monsgoose = require('mongoose')
const Answer = require('../models/answer')

const quizSchema = new monsgoose.Schema({
    owner: {
        type: monsgoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    group:{
        type: monsgoose.Schema.ObjectId,
        ref: 'Group',
        required: true
    },
    questions: [{
        _id: false,
        number: Number,
        question:{
            type: String,
            required: true,
            trim: true
        },
        choices: Array,
        solution: String,
        photo: String,
    }]

}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
})

quizSchema.virtual('Answers', {
    ref: 'Answer',
    foreignField: 'quizId',
    localField: '_id'
})

quizSchema.virtual('countAnswers').get(async function() {
    const num = await Answer.countDocuments({quizId: this._id})
    return num
})

quizSchema.index({group: 1, owner: 1});

const Quiz = new monsgoose.model('Quiz', quizSchema)

module.exports = Quiz