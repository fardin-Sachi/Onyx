import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import http from "http"
import { Server } from "socket.io"
import { connectDB } from "./utils/db.js"
import authRoutes from "./routes/auth.route.js"
import conversationRoutes from "./routes/conversation.route.js"
import messageRoutes from "./routes/message.route.js"
import { initializeSocket } from "./socket.js"
import { socketAuthMiddleware } from "./socket/socketAuth.middleware.js"
import RedisService from "./services/RedisService.js"
import envConfig from "./config/env.config.js"


const app = express()
const httpServer = http.createServer(app)

// Middlewares
app.use(cors({
    origin: envConfig.CLIENT_ORIGIN,
    credentials: true
}))
app.use(cookieParser())

app.use(express.json())

// routes
app.use('/api/auth', authRoutes)
app.use('/api/conversations', conversationRoutes)
app.use('/api/conversations', messageRoutes)
    // Health Check
app.get('/api/health', (req,res) => {
    res.status(200).json({
        success: true, 
        data: {
            message: 'API server is up an running'
        }
    });
})

const io = new Server(httpServer, {
    cors: {
        origin: envConfig.CLIENT_ORIGIN,
        credentials: true,
        methods: ["GET", "POST"]
    },
    pingInterval: 25000,
    pingTimeout: 60000,
})
io.use(socketAuthMiddleware)

await initializeSocket(io)

await RedisService.initialize()

try {
    await connectDB()

    const PORT = envConfig.PORT || 4000
    httpServer.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`)
    })
} catch (error) {
    console.error("The server failed to start", error)
    process.exit(1)
}