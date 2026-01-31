import dotenv from 'dotenv'
dotenv.config()
import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL)

const connectRedis = async () => {
  try {
    await redis.ping()
  } catch (error) {
    console.error(" Redis connection failed")
    throw error
  }
}

export { redis, connectRedis }
