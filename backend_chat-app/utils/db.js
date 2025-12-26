import mongoose from "mongoose"
import envConfig from "../config/env.config.js"

export const connectDB = async () => {
    const uri = envConfig.MONGO_URI
    if(!uri) throw new Error("MONGO_URI is not set")

    try {
        await mongoose.connect(uri, {dbName: 'chat-app'})
        console.log("MongoDB connected!")
    } catch (error) {
        console.error("MongoDB connection error", error)
        process.exit(1)
    }
}