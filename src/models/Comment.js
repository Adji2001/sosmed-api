const mongoose = require('mongoose')

const { Schema } = mongoose

const commentSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        max: 500,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Comment', commentSchema)