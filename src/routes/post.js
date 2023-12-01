const express = require('express')
const { 
    createPostHandler, 
    updatePostHandler, 
    deletePostHandler, 
    likeAndDislikePostHandler, 
    getPostHandler, 
    getTimelinePostHandler,
    getUserPostHandler
} = require('../handlers/post')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// create a post
router.post('/', requireAuth, createPostHandler)

// update a post
router.patch('/:id', requireAuth, updatePostHandler)

// delete a post
router.delete('/:id', requireAuth, deletePostHandler)

// like and dislike a post
router.put('/:id/like', requireAuth, likeAndDislikePostHandler)

// get a post
router.get('/:id', getPostHandler)

// get timeline all posts
router.get('/timeline/:userId', getTimelinePostHandler)

// get user's posts
router.get('/profile/:username', getUserPostHandler)

module.exports = router
