import express from 'express';
import { createServer } from 'node:http';
import path from 'node:path';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const url = '192.168.0.239';
const port = 3001;
const server = createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:3000'} });

app.use(express.static(path.resolve('public')));
app.use(cors({ origin: 'http://localhost:3000'}));

// app.get('/', (req, res) => {
//     res.sendFile(path.resolve('public', 'index.html'));
// })

const globalNamespace = io.of('/global');

globalNamespace.on('connection', socket => {
    console.log(`User ${socket.id} connected to global namespace`);
    socket.emit('connected', `User ${socket.id} connected to global namespace`);

    socket.on('joinRoom', room => {
        socket.join(room);
        console.log(`User ${socket.id} joined the ${room} room`);
        globalNamespace.to(room).emit('joinRoom', `User ${socket.id} joined room`);
    })

    socket.on('message', ({ room, message }) => {
        console.log(room, message)
        globalNamespace.to(room).emit('received', `${socket.id}: ${message}`);
    })
})

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`);
    io.emit('connected', `Conected, user id: ${socket.id}`)

    socket.on('message', message => {
        socket.emit('received', `Received message: ${message}`);
    })
});

server.listen(port, url, () => {
    console.log(`server running at http://${url}:${port}`)
})