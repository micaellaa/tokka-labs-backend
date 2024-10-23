import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import transactionRoutes from "./routes/transactionRoutes.js";
import { swapEventListener } from "./websockets/swapEventListener.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:5234",
  methods: ["GET", "POST"],
  credentials: true, 
};

app.use(cors(corsOptions));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5234", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Infura web socket listener
swapEventListener(io);

app.get("/", (req, res) => {
  res.send("test-message");
});

app.use("/transaction", transactionRoutes);

// Start the server
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});