
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
    console.log('a user connected', socket.id);
    socket.on("newRoom",(params)=>{
      rooms = rooms.filter(obj => obj.id !==socket.id);
      console.log("cleared rooms that were dubles");
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
    socket.on("join", (toId)=>{
      const exists = rooms.findIndex(obj => obj.id === toId)
      if(exists ===-1){
        socket.emit("error", "room doesnt exist")
      }else{
        if(rooms[exists].secure === true){
          io.to(toId).emit("join-requested", users.find(obj => obj.id===socket.id))
          console.log("requested to join")
          //handle sending join request
        }else{
          //just join
          socket.join(toId);
          console.log("user joined room")
        }
      }
    })
    socket.on("accept", (fromId)=>{
      io.to(fromId).emit("status", "your request was accepted")
      const joinerSocket= io.sockets.sockets.get(fromId);
      if(joinerSocket){
         joinerSocket.join(socket.id);
         socket.to(socket.id).emit("status", "a user joined the room")
      }else{
        socket.emit("status", "request is not valid")
      }
    })
    socket.on("reject", (fromId)=>{
      const joinerSocket= io.sockets.sockets.get(fromId);
      const msg= "your request to join "+ users.find(obj => obj.id === socket.id).name + " was rejected";
      socket.to(joinerSocket).emit("status", msg);
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