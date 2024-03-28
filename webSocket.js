const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    autoConnect: false,
    reconnect: true,
    
    cors: {
        origin :"http://localhost:3000",
        //origin :"https://online-poker-game.onrender.com",
        methods: ["GET", "POST"],
        autoConnect: false,
        reconnect: true
    },



//foucus on 
/**
 * 
 * commuinity card - web socket
 * our own cards - no web socket, except at the end.
 * 
 * 
 */
});

io.on("connection", (socket) => {
    console.log("USER CONNECTED: ", socket.id);

    socket.on("changeColor", (data) =>{
        //socket.broadcast.emit("receive_message", data.color);
        socket.to(data.roomName).emit("receive_message",data.color);
        console.log(data.color % 2,"@@@");
        console.log("room emiiting message to:", data.roomName);

    });

    // Listen for "disconnect" event
    socket.on("disconnect", () => {
        console.log("USER DISCONNECTED: ", socket.id);
        // Perform any cleanup or additional handling here
    });

    socket.on("createRoom", (roomName) => {
        console.log(`Joined table ${roomName}`);
        socket.join(roomName);
        socket.broadcast.emit("room_created", roomName);
    });
})

// io.on('changeColor', (data) =>{

//     console.log("color is", data);
//     socket.on("change")
// } )

server.listen(3001, () => {
    console.log("server is running");
})


