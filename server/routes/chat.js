const { createConversation, getConversation } = require('../controllers/conversationController')
const { createMessage, getMessage } = require('../controllers/messageController')

const router = require('express').Router()

router.post('/conversations', createConversation)
router.get('/conversations/:userId', getConversation)

router.post('/messages', createMessage)
router.get('/messages/:conversationId', getMessage)

module.exports = router