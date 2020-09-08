const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: true
    }, 
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true,
})

const Comment = new mongoose.model('Comment', commentSchema)

module.exports = Comment