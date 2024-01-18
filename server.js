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
    let playerIndex = -1
    for (const i in connections) {
        if (connections[i] === null) {
            playerIndex = i
            break
        }
    }

    socket.emit('pNum', playerIndex)
    console.log(`Player ${playerIndex} has connected! :D`)

    if (playerIndex === -1) return

    connections[playerIndex] = false

    socket.broadcast.emit('pCon', playerIndex)

    socket.on('disconnect', () => {
        console.log(`Player ${playerIndex} has disconnected D:`)
        connections[playerIndex] = null
        socket.broadcast.emit('pCon', playerIndex)
    })

    socket.on('pReady', () => {
        socket.broadcast.emit('eReady', playerIndex)
        connections[playerIndex] = true
    })

})