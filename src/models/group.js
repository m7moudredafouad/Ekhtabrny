const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    nextquiz: {
        quiz: {
            type: mongoose.Schema.ObjectId,
            ref: 'Quiz'
        },
        startsAt: Date,
        endsAt: Date
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
})

groupSchema.virtual('posts', {
    ref: 'Post',
    foreignField: 'groupId',
    localField: '_id'
})


const Group = new mongoose.model('Group', groupSchema)

module.exports = Group