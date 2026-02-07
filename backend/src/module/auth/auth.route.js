import express from 'express'
import validate from '../../middlewares/validate.middlewere.js';
import { loginSchema, resetPasswordSchema, signUpSchema } from './auth.validation.js';
import { login, signUp, refreshToken, logOut, resetPassword, requestOtp, verifyOtp } from './auth.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';


const router = express.Router();

router.post(
    "/signup",
    validate(signUpSchema),
    signUp
)

router.post(
    "/login",
    validate(loginSchema),
    login
)
router.post("/refresh", refreshToken);

router.delete("/logout",authMiddleware, logOut)

router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    resetPassword
)

router.post("/request-otp", requestOtp)
router.post("/verify-otp",verifyOtp)


export default router;