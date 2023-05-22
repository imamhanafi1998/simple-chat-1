// express
const express = require('express')
const app = express()

// body-parser
const bodyParser = require('body-parser')

// mongoose
const mongoose = require('mongoose')

// http
const http = require('http').Server(app)

// socket.io
const io = require('socket.io')(http)

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const Message = mongoose.model("Message", {
    name: String,
    message: String
})

const dbUrl = "mongodb+srv://guest:guest123@cluster0-s8l65.gcp.mongodb.net/messageDB?retryWrites=true&w=majority"
// const dbUrl = 'mongodb://amkurian:amkurian1@ds257981.mlab.com:57981/simple-chat'

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
        console.log("sukses")
    })
})
app.post('/messages', async (req, res) => {
    const message = new Message(req.body);
    await message.save((err) => {
        if (err) {
            console.log("gagal")
            sendStatus(500);
        }
        io.emit('message', req.body)
        res.sendStatus(200);
    })
})

// io.on('connection', () => {
//     console.log("client connected")
// })

let interval

io.on("connection", socket => {
    console.log("Client connected")
    if (interval) {
        clearInterval(interval)
    }
    socket.on("disconnect", () => {
        console.log("Client disconnected")
        clearInterval(interval)
    })
})


mongoose.connect(dbUrl, { useNewUrlParser: true })

const server = http.listen(3030, () => {
    console.log(`server is running on port ${server.address().port}`)
})