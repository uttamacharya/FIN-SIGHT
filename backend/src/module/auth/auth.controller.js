// import { success } from "zod";
import { signupService, loginService, refreshTokenService, logOutService } from "./auth.service.js";
import { AUTH_CONSTANTS } from "./auth.constants.js";
// import { token } from "morgan";

const signUp=async(req, res, next)=>{
    try {
        const {name, email, password}=req.body;
        const {user, accessToken, refreshToken}=await signupService({name, email, password, is_email_verified:true})

        res.cookie(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE, refreshToken, {
            httpOnly: true, //js can not eccess
            secure:process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30*24*60*60*1000
        })
        res.status(201).json({
            success:true,
            message:"Signup successful",
            accessToken,
            user
        });
    } catch (error) {
        next(error)
    }
}

const login= async(req, res, next)=>{
    try {
        const {email, password} =req.body;
        const {user, accessToken, refreshToken}=await loginService({
            email,
            password
        });
        res.cookie(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV==="production",
            sameSite:"lax",
            maxAge: 30*24*60*60*1000
        })
         res.status(200).json({
            success:true,
            message:"login successfull",
            accessToken,
            user:{
                id:user.id,
                name:user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error)
    }
}

// uses refreshtoken cookie to issue new access token
const refreshToken=async(req,res,next)=>{
    try {
        const refreshToken=req.cookies[AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE]
        if(!refreshToken){
            return res.status(401).json({
                success:false,
                message:"Refresh token missing"
            });
        }
        const {newAccessToken, newRefreshToken}=await refreshTokenService(refreshToken);
        res.cookie(
            AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE,
            newRefreshToken,
            {
                httpOnly:true,
                secure:process.env.NODE_ENV==='production',
                sameSite: 'strict',
                maxAge: 30*24*60*60*1000
            }
        )
        res.status(200).json({
            success:true,
            accessToken:newAccessToken
        })
    } catch (error) {
        next(error)
    }
}

// logout

const logOut= async(req, res, next)=>{
    try {
        const refreshToken=req.cookies[AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE]
        if(refreshToken){
            await logOutService(refreshToken);
        }
        // clear cookie
        res.clearCookie(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE, {
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:'strict'
        });
        res.status(200).json({
            success:true,
            message:"Logout successful"
        })
    } catch (error) {
        next(error)
    }
}

export{
    signUp,
    login,
    refreshToken,
    logOut
}