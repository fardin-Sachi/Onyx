import mongoose from 'mongoose'
// import dotenv from 'dotenv'
// dotenv.config()


export const connectDB = async () => {
    const uri = process.env.MONGO_URI
    if (!uri) {
        throw new Error("MONGO_URI is not set in environment variables")
    }

    try {
        await mongoose.connect(uri, {dbName: 'chat-app'} )
        console.log("MongoDB connected successfully")

    } catch (error) {
        console.error("MongoDB connection error: ", error)
        process.exit(1)
    }
}