const express = require('express')
const { 
    addMessageHandler, 
    getAllMessagesHandler, 
    getMessageHandler,
    deleteMessageHandler
} = require('../handlers/message')

const router = express.Router()

// Add new message
router.post('/', addMessageHandler)

// Get all messages
router.get('/', getAllMessagesHandler)

// Get message by convId
router.get('/:conversationId', getMessageHandler)

// Deelete a message
router.delete('/:messageId', deleteMessageHandler)

module.exports = router