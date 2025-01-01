const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the main HTML file with a GET request
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve static files like CSS, JavaScript, etc.
app.use(express.static(path.join(__dirname, 'public')));

let onlineUsers = {}; // Track online users



// When a user connects
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Add user to the online users list
    onlineUsers[socket.id] = socket;
    io.emit('updateOnlineUsers', Object.keys(onlineUsers)); // Broadcast online users list

    // Handle receiving chat messages
    socket.on('chatMessage', (msg) => {
        // Broadcast message to all other users (excluding the sender)
        socket.broadcast.emit('chatMessage', msg);
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        
        // Remove user from online users list
        delete onlineUsers[socket.id];
        io.emit('updateOnlineUsers', Object.keys(onlineUsers)); // Broadcast updated online users lists
    });
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




