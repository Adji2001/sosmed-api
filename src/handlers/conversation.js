const Conversation = require("../models/Conversation")

// create new conv
const createConversationHandler = async (req, res) => {
    try {
        const conversation = await Conversation.create({
            members: [req.body.senderId, req.body.receiveId]
        })

        res.status(201).json(conversation)
    } catch (err) {
        res.status(500).json(err)
    }
}

// GET all conversations
const getAllConversationsHandler = async (req, res) => {
    try {
        const conversations = await Conversation.find()

        res.json(conversations)
    } catch (err) {
        res.status(500).json(err)
    }
}

// GET conversation of a user
const getConversationHandler = async (req, res) => {
    const { userId } = req.params

    try {
        const conversation = await Conversation.find({
            members: { $in: [userId] }
        })

        res.json(conversation)
    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports = {
    createConversationHandler,
    getAllConversationsHandler,
    getConversationHandler
}