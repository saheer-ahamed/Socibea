const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({
    conversationId: String,
    sender: String,
    text: String
}, { timestamps: true });

module.exports = mongoose.model('messages', MessageSchema)