import redis from '../config/redis'

const setValue=async(Key, value, experyInSeconds)=>{
    await redis.set(Key, value, "EX", experyInSeconds)
}

const getValue=async (key)=>{
    return await redis.get(key)
}

const deleteValue= async (key)=>{
    return await redis.delete(key)
}