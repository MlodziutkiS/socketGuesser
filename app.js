
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
      rooms = rooms.filter(obj => obj.id !==socket.id);
      console.log("cleared rooms that were dubles")
      console.table(rooms);
      rooms.push({id: socket.id, duration: params.dura, pressure: params.pres, secure: params.secureBool})
      console.table(rooms);
    })
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on("name",(name)=>{
    const exists = users.findIndex(obj => obj.id === socket.id)
    if(exists===-1){
      const userObject= {id: socket.id, name: name}
      users.push(userObject);
    }else{
      users[exists].name = name;
    }
    console.table(users)
    })

  });

app.get('/rooms', (req,res)=>{
  const respondWith= rooms.map(room=>{
    let match = users.find(obj => obj.id === room.id);
    return {
      ...room, 
      name: match!==undefined? match.name : "guest",
    };
  })
  res.send(respondWith);
})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});