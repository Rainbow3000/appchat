const env = require('dotenv');
env.config(); 
const cors = require('cors')
const express = require('express'); 
const app = express(); 
app.use(cors())
app.use(express.json()); 
const { Server } = require("socket.io");

const connect = require('./src/utils/connectDB'); 
connect.connectDB(); 

const userRouter = require('./src/routers/userRouter'); 
const authenticateRouter = require('./src/routers/authenticateRouter'); 
const messageRouter = require('./src/routers/messageRouter')

const PORT = process.env.PORT || 5000

app.use(userRouter); 
app.use(authenticateRouter); 
app.use(messageRouter); 


const server =  app.listen(PORT,()=>console.log(`Server is running at http://localhost:${PORT}`))

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});


global.userOnline = new Map (); 

global.online = []; 

io.on("connection", (socket) => {
    socket.on('user-online',(userId)=>{
        userOnline.set(userId,socket.id); 
        if(online.indexOf(userId) === -1){
            online.push(userId)
        } 
        socket.emit("user-is-online",online);
        setInterval(()=>{
            socket.emit("user-is-online",online);
        },5000)
    })

 

    socket.on('client-send-data',(data)=>{
        const userSocket = userOnline.get(data.to);
        if(userSocket){
            socket.to(userSocket).emit('server-send-data',data); 
        }
    })


    socket.on('user-logout',(data)=>{
        if(data){
              online = online.filter(item=>item !== data); 
              socket.emit('server-send-user-logout',online); 
        }
    })
});









