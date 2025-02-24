
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

app.get('/play', (req,res)=>{
  res.sendFile(path.join(__dirname, "./gameSelection.html"))
})
app.get('/play/newRoom', (req,res)=>{
  res.sendFile(path.join(__dirname, "./roomCreator.html"))
})
app.get('/about', (req,res)=>{
  res.sendFile(path.join(__dirname, "./about.html"))
})
app.get('/name', (req,res)=>{
  res.sendFile(path.join(__dirname, "./name.html"))
})

let rooms=[]
let users=[{id: 'skibidi', name: 'toilet'}]

io.on('connection', (socket) => {
   // users.push({socket.id})
    console.log('a user connected');
    socket.on("newRoom",(params)=>{
      console.log("duration", params.dura, "pressure", params.pres, "secure", params.secureBool)
      rooms.push({id: socket.id, duration: params.dura, pressure: params.pres, secure: params.secureBool})
      console.table(rooms);
    })
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on("name",(name)=>{
     // users[socket.id].name= name;
    })

  });

app.get('/rooms', (req,res)=>{
  res.send(rooms);
})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});