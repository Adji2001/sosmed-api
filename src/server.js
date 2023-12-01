require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const conversationRouter = require('./routes/conversation')
const messageRouter = require('./routes/message')
const commentRouter = require('./routes/comment')
const uploadProfileRouter = require('./routes/profile')
const uploadPostRouter = require('./routes/postUpload')
const cors = require('cors')
const { Server } = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)

// middleware
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

// router
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)
app.use('/api/conversations', conversationRouter)
app.use('/api/messages', messageRouter)
app.use('/api/comments', commentRouter)
app.use('/api/profile', uploadProfileRouter)
app.use('/api/upload', uploadPostRouter)

// socket io configuration
const io = new Server(server, {
    cors: {
        origin: 'https://sosmed-client-ivory.vercel.app'
    }
});

let users = []

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({userId, socketId})
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId)
}

io.on("connection", (socket) => {
    // if connect
    console.log('a user connected')

    // take userid from socket client
    socket.on('addUser', userId => {
        addUser(userId, socket.id)

        // send mesage to client
        io.emit('getUsers', users)

    })

    // send and get message
    socket.on('sendMessage', ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId)

        io.to(user?.socketId).emit('getMessage', {
            senderId,
            text
        })
    })

    // disconnect server
    socket.on('disconnect', () => {
        console.log('disconnect a user')
        removeUser(socket.id)
        io.emit('getUsers', users)
    })
});
// end socket io


// connect to mongodb atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listening app
        server.listen(process.env.PORT, () => {
            console.log('DB connected & server running on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log('gagal => ', error)
    })
