const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    userId: { type: String, required: true },
    desc: String,
    likes: [],
    comments: [{
        userId: String,
        comment: String
    }],
    savedBy: [],
    image: String,
    video: String
},
    {
        timestamps: true
    });

module.exports = mongoose.model('posts', PostSchema)