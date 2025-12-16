import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import http from 'http'
import { connectDB } from './utils/db.js'
import authRoute from './routes/auth.route.js'
import conversationRoute from './routes/conversation.route.js'
import { Server } from 'socket.io'
import { initializeSocket } from './socket.js'
import { socketAuthMiddleware } from './socket/socketAuth.middleware.js'
import RedisService from './services/RedisService.js'
import messageRoutes from './routes/message.route.js'


dotenv.config()

const app = express()
const httpServer = http.createServer(app)


/// Middlewares
app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
}))

app.use(cookieParser())

app.use(express.json())


///Routes
app.use('/api/auth', authRoute)
app.use('/api/conversations', conversationRoute)
app.use('/api/conversations', messageRoutes)

///Socket.io setup
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
        methods: ["GET", "POST"]
    },
    pingInterval: 25000,
    pingTimeout: 60000
})

io.use(socketAuthMiddleware)

await initializeSocket(io)

// Redis setup
await RedisService.initialize()


// DB and Server connection
try {
    await connectDB()
    const PORT = process.env.PORT || 4000
    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })

} catch (error) {
    console.error("Server failed to start. Error: ", error)
    process.exit(1)
}