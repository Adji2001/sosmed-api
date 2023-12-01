const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { 
    createConversationHandler, 
    getAllConversationsHandler, 
    getConversationHandler
} = require('../handlers/conversation')

const router = express.Router()

// new Conv
router.post('/', createConversationHandler)

// GET all conversations
router.get('/', getAllConversationsHandler)

// GET conversation of a user
router.get('/:userId', getConversationHandler)

module.exports = router