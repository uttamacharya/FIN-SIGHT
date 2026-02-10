import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser"

import routes from "./routes/index.route.js"

const app = express()

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

app.use(cors({
  origin:(origin, callback) =>{
    if (!origin) return callback(null, true)
    if(allowedOrigins.includes(origin)){
      return callback(null, origin);
    } 
    return callback(new Error("Not allowed by CORS"))
  },
  credentials: true,
  methods:["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(helmet())
app.use(morgan("dev"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())   

app.use("/api", routes)

export default app
