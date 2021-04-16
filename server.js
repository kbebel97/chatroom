const path = require('path');
const http = require('http');
const express = require("express");
const socketio = require('socket.io');
const formatMessage = require('./util/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./util/users');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = "Admin"
//Set static folder
app.use(express.static(path.join(__dirname, 'html_css')));
// Run when a client connects 
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room}) => {
        console.log(room);
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        // Welcome new user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));
        
        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat!`));

        // Send users and room info 
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
        console.log(msg);
    })
    
    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });

        }
    });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));