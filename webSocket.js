const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);
let connectedUsers = [];
let arrayOfRooms = [];
let usersRooms = [];
let seatLayout = [];

const io = new Server(server, {
    autoConnect: false,
    reconnect: true,
    
    cors: {
        //origin :"http://localhost:3000",
        origin :"https://online-poker-game.onrender.com",
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
    socket.emit("room_created", arrayOfRooms);

    socket.on("userConnected", (data) =>{
        console.log("under userConnected: ",data.userName)
        connectedUsers.push({
            user: data.userName,
            id: socket.id
        });
        console.log(connectedUsers);
    })
    socket.on("changeColor", (data) =>{
        //socket.broadcast.emit("receive_message", data.color);
        socket.to(data.roomName).emit("receive_message",data.color);
        console.log(data.color % 2,"@@@");
        console.log("room emiiting message to:", data.roomName);

    });

    socket.on("selectSeat", (data) => {
        socket.to(data.roomName).emit("receiveSeatNumber", {...data, usersRooms: usersRooms});
        console.log(`${data.user.userName} sat at seat ${data.seatNumber} on table ${data.roomName}`);
        seatLayout.push({
            seatNumber:data.seatNumber, 
            userName:data.user.userName, 
            socketID:socket.id, 
            room: data.roomName
        });
    });

    // Listen for "disconnect" event
    //made by top G homero
    socket.on("disconnect", () => {
        console.log("USER DISCONNECTED: ", socket.id);
        console.log("Rooms Before ",usersRooms);
        usersRooms.forEach((obj,idx) =>{
            let deleteRoom = true;
            let hostIdx;
            if(obj.id === socket.id){
                let roomToBeDeleted = obj.room
                usersRooms.splice(idx,1);
                 usersRooms.forEach((obj, idx) =>{
                     if(obj.room === roomToBeDeleted){
                        deleteRoom = false;
                     }
                 });
                 if(deleteRoom){
                    arrayOfRooms.forEach((obj, idx)=>{
                        if(deleteRoom){
                        if(obj === roomToBeDeleted){
                            arrayOfRooms.splice(idx,1);
                            deleteRoom = !deleteRoom;
                        }
                    }
                    });
                    console.log("Rooms After: ", arrayOfRooms);                  
                    socket.broadcast.emit("removeRoom",arrayOfRooms);
                 }
                //return;
            }
        });


        connectedUsers = connectedUsers.filter(user => {
            return user.id !== socket.id;
        });
        
        console.log("After ",usersRooms);
        
        // Perform any cleanup or additional handling here
    });

    socket.on("createRoom", (data) => {
        console.log(`Joined table ${data.roomName}`);
        arrayOfRooms.push(data.roomName);
        usersRooms.push({
            userName: data.userName,
            id: socket.id,
            room: data.roomName
        });
        socket.broadcast.emit("room_created", arrayOfRooms);
        socket.join(data.roomName);
        console.log(`#####${arrayOfRooms}`)
    });
    socket.on("playerJoined", (data) =>{
        socket.join(data.room)
        console.log(`${data.userName} is joining room: ${data.room}`)
        usersRooms.push({
            userName: data.userName,
            id:socket.id,
            room: data.room
        })
        // Find the seatLayout for the current room
    const roomSeatLayout = seatLayout.filter(seat => seat.room === data.room);
    
    // Emit the room's seatLayout to the player who just joined
    socket.emit("update_room", roomSeatLayout);
        console.log("the ammount of people in the current room seesion:", usersRooms, arrayOfRooms)
    });

})

// io.on('changeColor', (data) =>{

//     console.log("color is", data);
//     socket.on("change")
// } )

server.listen(3001, () => {
    console.log("server is running");
})


