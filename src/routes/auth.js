const express = require('express')
const { registerHandler, loginHandler } = require('../handlers/auth')

const router = express.Router()

// REGISTER auth route
router.post('/register', registerHandler)

// LOGIN auth route
router.post('/login', loginHandler)

module.exports = router