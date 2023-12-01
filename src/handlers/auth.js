const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// CREATE token
const createToken = (userId) => {
    return jwt.sign({userId}, process.env.TOKEN_SECRET, {expiresIn: '7d'})
}

// REGISTER handler
const registerHandler = async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body

    // generate hashed password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    try {

        const user = await User.create({username, email, password: hashedPassword})
        const token = createToken(user._id)

        res.status(201).json({
            msg: 'register user success',
            data: {
                user,
                token
            }
        })
    } catch(error) {
        res.status(400).json({
            error: error.message
        })
    }
}

// LOGIN handler
const loginHandler = async (req, res) => {
    
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})

        if (!user) {
            return res.status(404).json({msg: 'user not found'})
        }
        
        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            return res.status(400).json({msg: 'wrong password'})
        }

        const token = createToken(user._id)

        res.status(200).json({
            msg: 'login success',
            user,
            token
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {
    registerHandler,
    loginHandler
}