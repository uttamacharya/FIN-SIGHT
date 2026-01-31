import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { getMyProfile } from "./user.controller.js";

const router = express.Router();

/**
 * GET /api/users/me
 *Protected route
 * Access token required
 */
router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

export default router;
