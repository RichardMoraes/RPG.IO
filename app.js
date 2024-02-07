import express from 'express';
import { createServer } from 'node:http';
import path from 'node:path';
import { Server } from 'socket.io';

const app = express();
const url = '192.168.0.239';
const port = 3000;
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve('public')))

app.get('/', (req, res) => {
    res.sendFile(path.resolve('public', 'index.html'));
})

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`);

    socket.on('message', message => {
        io.emit('received', `Received message: ${message}`)
    })
});

server.listen(port, url, () => {
    console.log(`server running at http://${url}:${port}`)
})