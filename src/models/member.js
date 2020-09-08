const mongoose = require('mongoose')

const memberSchema = mongoose.Schema({
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
    name:{
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: Number,
        required: true,
        min: 0
    },
    role: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['pending', 'member', 'admin']
    }
})

memberSchema.index({groupId: 1})
memberSchema.index({groupId: 1, userId: 1}, {unique: true})
memberSchema.index({groupId: 1, code: 1}, {unique: true})


const Member = mongoose.model('Member', memberSchema)

module.exports = Member