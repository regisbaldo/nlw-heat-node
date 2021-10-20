import express from "express";
import { router } from "./services/routes";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";


const app = express();

app.use(express.json());
app.use(router);
app.use(cors());

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`User conected in socket ${socket.id}`);
});

export {io, serverHttp}

