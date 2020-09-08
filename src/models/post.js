const mongoose = require('mongoose')
const Comment = require('./comment')
const Vote = require('./vote')

const postSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Group',
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    content: String,
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
})

postSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'postId',
    localField: '_id'
})
postSchema.virtual('countComments', {
    ref: 'Comment',
    foreignField: 'postId',
    localField: '_id',
    count: true
})

postSchema.virtual('votes', {
    ref: 'Vote',
    foreignField: 'postId',
    localField: '_id'
})

postSchema.index({groupId: 1, createdAt: 1})

postSchema.pre('find', function(next) {
    this.populate('userId', 'name')
    .populate('votes', 'userId -_id -postId')
    .populate('countComments')
    next()
})

postSchema.pre('findByIdAndDelete', function(next) {
    Comment.remove({postId: this._id})
    Vote.remove({postId: this._id})
    next()
})


const Post = new mongoose.model('Post', postSchema)
module.exports = Post