const mongoose = require('mongoose')

const { Schema } = mongoose

const UsersSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    profilePicture: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    desc: {
        type: String,
        max: 50
    },
    city: {
        type: String,
        max: 50
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    collage: {
        type: String,
        max: 12
    },
    birthday: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true})

module.exports = mongoose.model('User', UsersSchema)