import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser"

import routes from "./routes/index.route.js"

const app = express()

/app.use(
  cors({
    origin: true,        // allow all origins
    credentials: true,
  })
);
app.use(morgan("dev"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())   

app.use("/api", routes)

export default app
