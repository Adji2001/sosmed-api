const bcrypt = require('bcrypt')
const User = require('../models/User')

// update user
const updateUserHandler = async (req, res) => {
    const {userId, password, isAdmin} = req.body
    const {id} = req.params

    if (userId === id || isAdmin) {
        if (password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(password, salt)
            } catch (error) {
                return res.status(500).json({
                    error: error.message
                })
            }
        } 

        try {
            await User.findByIdAndUpdate(id, {
                $set: req.body
            })
            res.status(200).json({
                msg: 'Account has been updated',
            })
        } catch (error) {
            return res.status(500).json({
                error: error.message
            })
        }
    } else {
        return res.status(403).json({
            error: 'You can update only your account!'
        })
    }
}

// delete user
const deleteUserHandler = async (req, res) => {
    const {userId, isAdmin} = req.body
    const {id} = req.params

    if (userId === id || isAdmin) {
        try {
            await User.findByIdAndDelete(id)
            res.status(200).json({
                msg: 'Account has been deleted',
            })
        } catch (error) {
            return res.status(500).json({
                error: error.message
            })
        }
    } else {
        return res.status(403).json({
            error: 'You can delete only your account!'
        })
    }
}

// get a user
const getUserHandler = async (req, res) => {
    const { userId, username } = req.query

    try {
        const user = userId ? await User.findById(userId) : await User.findOne({username})

        if (!user) {
            return res.status(404).json({msg: 'user not found'})
        }

        const { password, updatedAt, ...other } = user._doc

        res.status(200).json({
            msg: 'get a user',
            other
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

// follow a user
const followUserHandler = async (req, res) => {
    const {userId} = req.body
    const {id} = req.params

    if (userId !== id) {
        try {
            const user = await User.findById(id)
            const currentUser = await User.findById(userId)

            if (!user.followers.includes(userId)) {
                await user.updateOne({ $push: { followers: userId } })
                await currentUser.updateOne({ $push: { following: id } })

                res.status(200).json({
                    msg: 'User has been followed'
                })
            } else {
                res.status(403).json({
                    msg: 'You already follow this user'
                })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json({
            msg: "You can't follow yourself"
        })
    }
    
}

// unfollow a user
const unfollowUserHandler = async (req, res) => {
    const {userId} = req.body
    const {id} = req.params

    if (userId !== id) {
        try {
            const user = await User.findById(id)
            const currentUser = await User.findById(userId)

            if (user.followers.includes(userId)) {
                await user.updateOne({ $pull: { followers: userId } })
                await currentUser.updateOne({ $pull: { following: id } })

                res.status(200).json({
                    msg: 'User has been unfollowed'
                })
            } else {
                res.status(403).json({
                    msg: "You don't follow this user"
                })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json({
            msg: "You can't unfollow yourself"
        })
    }
    
}

// get friends
const getFriendsHandler = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)

        const friends = await Promise.all(
            user.following.map((friendId) => {
                return User.findById(friendId)
            })
        )

        const friendList = []
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend

            friendList.push({ _id, username, profilePicture })
        })

        res.status(201).json(friendList)
    } catch (err) {
        res.status(404).json(err)
    }
}

// get all users
const getAllUsersHandler = async (req, res) => {
    try {
        const users = await User.find()

        res.status(200).json(users)
    } catch (error) {
        res.status(404).json(error)
    }
}

// edit user
const editUserHandler = async (req, res) => {
    const { userId } = req.params

    try {
        const user = await User.findOneAndUpdate({ _id: userId }, req.body)

        res.json(user)
    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports = {
    getUserHandler,
    updateUserHandler,
    deleteUserHandler,
    followUserHandler,
    unfollowUserHandler,
    getFriendsHandler,
    getAllUsersHandler,
    editUserHandler
}