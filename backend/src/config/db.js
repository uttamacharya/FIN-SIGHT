import dotenv from 'dotenv'
dotenv.config();
import pkg from 'pg'
const {Pool} =pkg;


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    sssl: {
      rejectUnauthorized: false
  }
})

const connectDB= async()=>{
    try {
        await pool.query("SELECT 1")
    } catch (error) {
        console.error("Postgresql connection failed");
        throw error
    }
}

export {pool, connectDB}