import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { CLIENT_URL, PORT } from './config/variables.js';
import { connectDB } from './config/dbConfig.js';
import userRouter from './routes/v1/user.route.js';
import swaggerDocs from '../swagger.js';
import swaggerUi from 'swagger-ui-express';
import cookieParser from "cookie-parser";
import pollRouter from './routes/v1/poll.route.js';
import { handlePollSocket } from './socket/poll.socket.js';
import voteRouter from './routes/v1/vote.route.js';
import likeRouter from './routes/v1/like.route.js';

const app = express();
const httpServer = createServer(app);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const io = new Server(httpServer, {
    cors: {
        origin: CLIENT_URL,
        credentials: true
    }
})

// Set io instance in app for use in routes
app.set('io', io);

handlePollSocket(io);


app.use(cookieParser());
app.use(cors(
    {
        origin: CLIENT_URL,
        credentials: true,
    }
))
app.use(express.json())
app.get("/ping", (_req, res) => {
    res.json({ message: "pong" })
})

app.use("/api/v1/poll", pollRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/vote", voteRouter);
app.use("/api/v1/like", likeRouter);

await connectDB();
httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})