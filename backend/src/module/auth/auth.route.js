import express from 'express'
import validate from '../../middlewares/validate.middlewere.js';
import { forgetPasswordSchema, loginSchema, resetPasswordSchema, signUpSchema } from './auth.validation.js';
import { login, signUp, refreshToken, logOut, forgetPassword, resetPassword, requestOtp, verifyOtp } from './auth.controller.js';


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

router.delete("/logout", logOut)

router.post(
    "/forget-password",
    validate(forgetPasswordSchema),
    forgetPassword)

    
router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    resetPassword
)

router.post("/request-otp", requestOtp)
router.post("/verify-otp",verifyOtp)


export default router;