const mongoose = require('mongoose')

const CommentSchema = mongoose.Schema({
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    comments: String,
    deleted: {
        type: Boolean,
        default: false
    },
    edited: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('comments', CommentSchema)