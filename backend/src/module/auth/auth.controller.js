// import { success } from "zod";
import { signupService, loginService, refreshTokenService, logOutService, forgetPasswordService, resetPasswordService } from "./auth.service.js";
import { AUTH_CONSTANTS } from "./auth.constants.js";
import { generateResetToken } from "../../utils/resetPasswordToken.js";
import sendEmail from "../../config/mailer.js";
import { findUserByEmail } from "../user/user.model.js";
import { redis } from "../../config/redis.js";
// import { email, success } from "zod";
// import { token } from "morgan";

const signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const { user, accessToken, refreshToken } = await signupService({ name, email, password, is_email_verified: true })

        res.cookie(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE, refreshToken, {
            httpOnly: true, //js can not eccess
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        res.status(201).json({
            success: true,
            message: "Signup successful",
            accessToken,
            user
        });
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await loginService({
            email,
            password
        });
        res.cookie(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            success: true,
            message: "login successfull",
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error)
    }
}

// uses refresh token cookie to issue new access token
const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies[AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE]
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token missing"
            });
        }
        const { newAccessToken, newRefreshToken } = await refreshTokenService(refreshToken);
        res.cookie(
            AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE,
            newRefreshToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            }
        )
        res.status(200).json({
            success: true,
            accessToken: newAccessToken
        })
    } catch (error) {
        next(error)
    }
}

// logout

const logOut = async (req, res, next) => {
    try {
        const refreshToken = req.cookies[AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE]
        if (refreshToken) {
            await logOutService(refreshToken);
        }
        // clear cookie
        res.clearCookie(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(200).json({
            success: true,
            message: "Logout successful"
        })
    } catch (error) {
        next(error)
    }
}

// forget Password controller

const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body //and we can write email=req.body.email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }
        const token = await forgetPasswordService(email)
        if (token) {
            const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

            await sendEmail({
                to: email,
                subject: "Reset Your Password",
                html: `
             <p>Click below to reset your password:</p>
             <a href="${resetLink}">Reset password</a>
             <p>This link is expired in 15 minutes</p>
            `
            })
        }

        res.status(200).json({
            success: true,
            message: "if email exists then i forgetReset link will share"
        })
    } catch (error) {
        next(error)
    }
}

// reset password
const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body
        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password is required"
            })
        }
        await resetPasswordService({ token, newPassword })
        res.status(200).json({
            success: true,
            message: "Password reset successful"
        })
    } catch (error) {
        next(error);
    }
}

const requestOtp = async (req, res, next) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email required"
            })
        }
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please register first "
            })
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await redis.set(
            `otp:${email}`,
            otp,
            "EX",
            5 * 60
        );

        await sendEmail({
            to: email,
            subject: "Your otp for password reset",
            html: ` 
              <p>Your OTP is</p>
              <h2>${otp}</h2>
              <p>Valid for 5 minutes</p>
            `
        })
        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
         next(error)
    }
}


const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP  are required"
            })
        }

        const saveOtp = await redis.get(`otp:${email}`)
        if (!saveOtp || saveOtp != otp) {
            return res.status(400).json({
                success: false,
                message: "OTP does not match"
            })
        }

        await redis.set(
            `otp-verified:${email}`,
            "true",
            "EX",
            10 * 60 //10 minutes
        )

        await redis.del(`otp:${email}`);
        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        })

    } catch (error) {
        next(error)
    }
}

export {
    signUp,
    login,
    refreshToken,
    logOut,
    forgetPassword,
    resetPassword,
    verifyOtp,
    requestOtp
}