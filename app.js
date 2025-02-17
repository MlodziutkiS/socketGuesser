
const express = require('express');
const { createServer } = require('node:http');
const path = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"))
  })

app.get('/oelyx.png', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/oelyx.png"))
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on("message",(value)=>{
        console.log(value);
    })
  });

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});