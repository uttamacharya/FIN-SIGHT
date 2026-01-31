import dotenv from "dotenv"
dotenv.config()
import app from './app.js'
import { connectDB } from "./config/db.js"
import { connectRedis } from "./config/redis.js"
const PORT = process.env.PORT || 2005



const startServer = async () => {
    try {
        await connectDB()
        console.log("postgresql connected")

        await connectRedis()
        console.log(" Redis connected")

        app.listen(PORT, () => {
            console.log("server started")
        })
    } catch (error) {
         console.error("server coneection failed")
         throw error;
    }
}

startServer() 

