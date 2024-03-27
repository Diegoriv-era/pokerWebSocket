const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin :"http://localhost:3000",
        methods: ["GET", "POST"],
    },



});

io.on("connection", (socket) => {
    console.log("USER CONNECTED: ", socket.id);

    socket.on("changeColor", (data) =>{
        socket.broadcast.emit("receive_message", data.color);
        console.log(data.color,"@@@");

    });
})

// io.on('changeColor', (data) =>{

//     console.log("color is", data);
//     socket.on("change")
// } )

server.listen(3001, () => {
    console.log("server is running");
})


