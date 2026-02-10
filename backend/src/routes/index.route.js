import express from "express";
import userRoute from "../module/user/user.route.js";
import authRoute from "../module/auth/auth.route.js";
import uploadRoute from "../module/upload/upload.route.js";
import analysisRoute from "../module/analysis/analysis.route.js";

import authMiddleware from "../middlewares/auth.middleware.js";



const router = express.Router();

router.use("/auth", authRoute);

router.use(authMiddleware);

router.use("/users", userRoute);
router.use("/upload", uploadRoute);
router.use("/analysis", analysisRoute);

export default router;
