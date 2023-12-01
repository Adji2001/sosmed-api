const Post = require("../models/Post")
const User = require("../models/User")
const fs = require('fs')

// create a post
const createPostHandler = async (req, res) => {
    try {
        const post = await Post.create(req.body)

        res.status(201).json({
            msg: 'Post created',
            post
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

// update a post
const updatePostHandler = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const postImage = await Post.findById(req.params.id).select('img')

        // ampe /backend
        const directory = process.cwd()

        if (post.userId === req.body.userId) {

            await post.updateOne({ $set: req.body })

            res.status(200).json({
                msg: 'Post updated'
            })

            if (postImage.img && req.body.img) {
                fs.unlink(`${directory}/public/${postImage.img}`, (err) => {
                        if(err && err.code == 'ENOENT') {
                            // file doens't exist
                            res.json({msg: "File doesn't exist, won't remove it."});
                        } else if (err) {
                            // other errors, e.g. maybe we don't have enough permission
                            res.json({msg: "Error occurred while trying to remove file"});
                        } else {
                            console.log('update foto berhasil')
                        }
                    })
            }

            
        } else {
            res.status(403).json({
                msg: 'You can update only your post'
            })
        }

        
    } catch (error) {
        res.status(500).json(error)
    }
}

// delete a post
const deletePostHandler = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const postImage = await Post.findById(req.params.id).select('img')

        const directory = process.cwd()

        if (post.userId === req.body.userId) {

            if (postImage.img) {
                fs.unlink(`${directory}/public/${postImage.img}`, (err) => {
                        if(err && err.code == 'ENOENT') {
                            // file doens't exist
                            res.json({msg: "File doesn't exist, won't remove it."});
                        } else if (err) {
                            // other errors, e.g. maybe we don't have enough permission
                            res.json({msg: "Error occurred while trying to remove file"});
                        } else {
                            console.log('update foto berhasil')
                        }
                    })
            }

            await post.deleteOne()

            res.status(200).json({
                msg: 'Post has been deleted'
            })
        } else {
            res.status(403).json({
                msg: 'You can delete only your post'
            })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// like/dislike a post
const likeAndDislikePostHandler = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })

            res.status(200).json({
                msg: 'Post has been liked'
            })
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })

            res.status(200).json({
                msg: 'Post has been disliked'
            })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// get a post
const getPostHandler = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' })
        }

        res.status(200).json({
            msg: 'Get a post',
            post
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

// get timeline all posts
const getTimelinePostHandler = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const userPosts = await Post.find({ userId: currentUser._id }).sort({createdAt: -1})
        const friendsPosts = await Promise.all(
            currentUser.following.map((firendId) => {
                return Post.find({ userId: firendId }).sort({createdAt: -1})
            })
        )
        res.status(200).json({
            msg: 'All posts from current user and following',
            posts: userPosts.concat(...friendsPosts)
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

// get user post
const getUserPostHandler = async (req, res) => {
    const { username } = req.params

    try {
        const user = await User.findOne({username})
        const posts = await Post.find({ userId: user._id })

        res.json(posts)
    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports = {
    createPostHandler,
    updatePostHandler,
    deletePostHandler,
    likeAndDislikePostHandler,
    getPostHandler,
    getTimelinePostHandler,
    getUserPostHandler,
}