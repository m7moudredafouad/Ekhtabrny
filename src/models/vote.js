const mongoose = require('mongoose')

const voteSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: true
    }, 
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})

voteSchema.index({postId: 1, userId: 1}, {unique: true})

const Vote = new mongoose.model('Vote', voteSchema)

module.exports = Vote