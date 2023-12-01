const jwt = require("jsonwebtoken")
const User = require('../models/User')

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({error: 'you must be logged in'})
    }

    const token = authorization.split(" ")[1]

    try {
        const _id = jwt.verify(token, process.env.TOKEN_SECRET)

        req.user = User.findOne({ _id }).select('_id')

        next()
    } catch (error) {
        console.log(error)

        res.status(401).json({error: 'request is not authorized. Invalid token'})
    }
}

module.exports = requireAuth