const express = require('express')
const { 
    updateUserHandler, 
    deleteUserHandler, 
    getUserHandler, 
    followUserHandler, 
    unfollowUserHandler,
    getFriendsHandler,
    getAllUsersHandler,
    editUserHandler
} = require('../handlers/user')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()


// update user
router.put('/:id', requireAuth, updateUserHandler)

// delete user
router.delete('/:id', requireAuth, deleteUserHandler)

// get a user
router.get('/', getUserHandler)

// follow a user
router.put('/:id/follow', requireAuth, followUserHandler)

// unfollow a user
router.put('/:id/unfollow', requireAuth, unfollowUserHandler)

// get friends
router.get('/friends/:userId', getFriendsHandler)

// get all users
router.get('/all', getAllUsersHandler)

// patch a user
router.patch('/:userId', editUserHandler)

module.exports = router