const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

server.listen(PORT, () => console.log('Running on port: ' + PORT))

const connections = [null, null]
io.on('connection', socket => {
    console.log('Websocket connection made')
})