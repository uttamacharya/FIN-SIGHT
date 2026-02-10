import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser"

import routes from "./routes/index.route.js"

const app = express()

/*Debug logger (safe) */
// app.use((req, res, next) => {
//   console.log("REQ:", req.method, req.url, "ORIGIN:", req.headers.origin);
//   next();
// });

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // health checks / curl / server-to-server
//       if (!origin) return callback(null, true);

//       const allowedOrigins = [
//         "http://localhost:5173",                 // local
//         "https://fin-sight-chi-coral.vercel.app", // prod
//       ];

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(null, false); // do NOT throw error
//     },
//     credentials: true,
//   })
// );

// app.use((req, res, next) => {
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Origin", req.headers.origin);
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Authorization"
//     );
//     res.header(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PUT, DELETE, OPTIONS"
//     );
//     return res.sendStatus(204);
//   }
//   next();
// });

// app.use(
//   helmet({
//     crossOriginResourcePolicy: false,
//   })
// );

app.use(morgan("dev"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())   

app.use("/api", routes)

export default app
