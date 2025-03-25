const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files correctly
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    socket.on("sendLocation", (location) => {
        io.emit("locationMessage", {id: socket.id, ...location});
    });
    socket.on("disconnect", () => {
        io.emit("locationMessage", {id: socket.id});
        console.log("User disconnected");  
    });
    console.log("New WS Connection");
});

// Render the correct view
app.get('/', (req, res) => {
    res.render('index'); // Ensure 'views/index.ejs' exists
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
