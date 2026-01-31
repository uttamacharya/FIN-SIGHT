import express from 'express'
import validate from '../../middlewares/validate.middlewere.js';
import { loginSchema, signUpSchema } from './auth.validation.js';
import { login, signUp, refreshToken, logOut } from './auth.controller.js';


const router =express.Router();

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


export default router;