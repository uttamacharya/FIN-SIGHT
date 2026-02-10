import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser"

import routes from "./routes/index.route.js"

const app = express()

app.use((req, res, next) => {
  console.log(
    "BEFORE CORS 👉 ->> ",
    req.method,
    req.url,
    "ORIGIN:",
    req.headers.origin
  );
  next();
});
// const allowedOrigins = [
//   process.env.FRONTEND_URL?.replace(/\/$/, ""),
//   "http://localhost:5173",
// ];

app.use(
  cors({
    origin: (origin, callback) => {
      // health checks / curl / server-to-server
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",                 // local
        "https://fin-sight-chi-coral.vercel.app", // prod
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false); // do NOT throw error
    },
    credentials: true,
  })
);



app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url, "ORIGIN:", req.headers.origin);
  next();
});


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
