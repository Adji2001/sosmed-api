const express = require('express')
const { getAllCommentsHandler, getCommentHandler, createCommentHandler, deleteCommentHandler } = require('../handlers/comment')

const router = express.Router()

// GET all comments
router.get('/', getAllCommentsHandler)

// GET comment by post id
router.get('/:postId', getCommentHandler)

// POST a comment by post id
router.post('/', createCommentHandler)

// DELETE a comment by comment id
router.delete('/:commentId', deleteCommentHandler)

module.exports = router