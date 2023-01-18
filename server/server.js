const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { readdirSync } = require('fs')
const app = express()
const mongoose = require('mongoose')
const options = {
    origin: ['http://localhost:3000', 'https://socibea.netlify.app'],
    useSuccessStatus: 200
}
const { createServer } = require('http')
const { Server } = require('socket.io')


dotenv.config()

app.use(express.json())
app.use(cors(options))



//routes
readdirSync('./routes').map((r) => app.use('/', require('./routes/' + r)))


const httpServer=createServer(app)
const io=new Server(httpServer,{
    cors:{
        origin:['http://localhost:3000', 'https://socibea.netlify.app']
    }
})

let users = []

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) && users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
    // when disconnect
    console.log("a user connected");

    // take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    })

    // send and get messages
    socket.on("sendMessage", ({senderId, receiverId, text}) => {
        const user = getUser(receiverId)
        io.to(user?.socketId).emit("getMessage", {
            senderId, text
        })
    })
    
    // when a user disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected");
        removeUser(socket.id)
        io.emit("getUsers", users)
    })
})

//database
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
}).then(() => console.log('Databse Connected'))
    .catch((error) => console.log("database connection error", error))



const PORT = process.env.PORT || 8000
httpServer.listen(PORT, () => {
    console.log('serverrrr')
})
