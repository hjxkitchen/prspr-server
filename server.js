const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins; restrict this in production
    methods: ["GET", "POST"],
  },
});

const peers = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Initialize Position
  peers[socket.id] = { x: 0, y: 0 };

  // Broadcast Updated Positions
  socket.on("updatePosition", (position) => {
    peers[socket.id] = position;
    io.emit("updatePeers", peers);
  });

  // Handle Peer Audio Streams
  socket.on("joinRoom", ({ stream }) => {
    for (const [id, peer] of Object.entries(peers)) {
      if (id !== socket.id) {
        io.to(id).emit("peerStream", { id: socket.id, stream });
      }
    }
  });

  // Handle Disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    delete peers[socket.id];
    io.emit("peerDisconnected", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server listening on http://localhost:5000");
});
