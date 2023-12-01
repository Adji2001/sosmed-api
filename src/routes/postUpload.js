const express = require('express')
const multer = require('multer')
const router = express.Router()

const storage = multer.diskStorage({
    destination: (res, file, cb) => {
        cb(null, 'public/posts')
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const upload = multer({storage})

// upload image post
router.post('/', upload.single('file'), (req, res) => {
    try {
        return res.status(201).json('File uploaded successfully')
    } catch (err) {
        console.log(err)
    }
})

module.exports = router