const Comment = require("../models/Comment")

const getAllCommentsHandler = async (req, res) => {
    try {
        const comments = await Comment.find()

        res.json({comments})
    } catch (err) {
        res.status(500).json(err)
    }
}

const getCommentHandler = async (req, res) => {
    const { postId } = req.params

    try {
        const comment = await Comment.find({ postId })

        res.json(comment)
    } catch (err) {
        res.status(500).json(err)
    }
}

const createCommentHandler = async (req, res) => {
    try {
        const comments = await Comment.create(req.body)

        res.status(201).json(comments)
    } catch (err) {
        res.status(500).json(err)
    }
}

const deleteCommentHandler = async (req, res) => {
    const { commentId } = req.params

    try {
        const comment = await Comment.findOneAndDelete({ _id: commentId })

        res.json(comment)
    } catch (err) {
        res.status(500).json(err)
    }
}


module.exports = {
    getAllCommentsHandler,
    getCommentHandler,
    createCommentHandler,
    deleteCommentHandler
}