const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    autoConnect: false,
    reconnect: false,
    cors: {
        origin :"http://localhost:3000",
        methods: ["GET", "POST"],
        autoConnect: false,
        reconnect: false
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
        socket.broadcast.emit("receive_message", data.color);
        console.log(data.color,"@@@");

    });

        // Listen for "disconnect" event
        socket.on("disconnect", () => {
            console.log("USER DISCONNECTED: ", socket.id);
            // Perform any cleanup or additional handling here
        });
})

// io.on('changeColor', (data) =>{

//     console.log("color is", data);
//     socket.on("change")
// } )

server.listen(3001, () => {
    console.log("server is running");
})


