import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser"

import routes from "./routes/index.route.js"

const app = express()

const allowedOrigins = [
    process.env.FRONTEND_URL?.replace(/\/$/, ""), // Agar env me galti se slash ho to hata dega
    "http://localhost:5173"                       // Yaha se slash hata diya
];

app.use(cors({
    origin: function (origin, callback) {
        // Debugging ke liye: Render logs me dikhega ki request kaha se aayi
        console.log("Request Origin:", origin); 

        // Postman ya Server-to-Server requests ke liye (!origin allow karein)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin); // Logs me dikhega agar block hua
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(helmet())
app.use(morgan("dev"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())   

app.use("/api", routes)

export default app
