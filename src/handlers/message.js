const Message = require("../models/Message")

// ADD new message
const addMessageHandler = async (req, res) => {
    try {
        const newMessage = await Message.create(req.body)

        res.status(201).json(newMessage)
    } catch (err) {
        res.status(500).json(err)
    }
}

// GET all message
const getAllMessagesHandler = async (req, res) => {
    try {
        const messages = await Message.find()

        res.json(messages)
    } catch (err) {
        res.status(500).json(err)
    }
}

// GET a message by conversation id
const getMessageHandler = async (req, res) => {
    const { conversationId } = req.params

    try {
        const message = await Message.find({ conversationId })

        res.json(message)
    } catch (err) {
        res.status(500).json(err)
    }
}

// DELETE message by message id
const deleteMessageHandler = async (req, res) => {
    const { messageId } = req.params

    try {
        const message = await Message.findOneAndDelete({ _id: messageId })

        res.json({msg: 'message has been deleted', message})
    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports = {
    addMessageHandler,
    getAllMessagesHandler,
    getMessageHandler,
    deleteMessageHandler
}