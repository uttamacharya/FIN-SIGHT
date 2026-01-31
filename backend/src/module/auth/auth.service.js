import dotenv from 'dotenv'
dotenv.config()
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { AUTH_CONSTANTS } from './auth.constants.js'
import { checkUserByEmail } from '../user/user.service.js'

import { createUser, findUserByEmail } from '../user/user.model.js'
import { redis } from "../../config/redis.js";
// import { refreshToken } from './auth.controller.js'



// generate jwt token

const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY }
    )
    return { accessToken, refreshToken }
};

// Now signup

const signupService = async ({ name, email, password, is_email_verified }) => {
    const existingUser = await checkUserByEmail(email)
    if (existingUser) {
        throw new AppError("Users already exists with this email ID")

    }

    // other wise hash password
    const hashedPassword = await bcrypt.hash(
        password,
        AUTH_CONSTANTS.PASSWORD_SALT_ROUND
    );

    // now create new user
    const user = await createUser({
        name,
        email,
        password: hashedPassword,
        is_email_verified
    });

    // generate token

    const { accessToken, refreshToken } = generateTokens(user.id)

    // store refresh token in redis
    const redisKey = AUTH_CONSTANTS.REDIS_REFRESH_TOKEN_PREFIX + user.id

    await redis.set(
        redisKey,
        refreshToken,
        "EX",
        30*24*60 * 60
    )

    return {
        user,
        accessToken,
        refreshToken
    }
}

// now login service
const loginService = async ({ email, password }) => {
    const user = await findUserByEmail(email)
    if (!user) {
        const err = new Error("Email not verified")
        err.statusCode = 401
        throw err
    }

    // compare password
    const ispasswordValid = await bcrypt.compare(
        password,
        user.password
    );
    if (!ispasswordValid) {
        const err = new Error("Password  not verified")
        err.statusCode = 401
        throw err
    }

    // check email is verifyed or not
    if (!user.is_email_verified) {  //ye db se check karega
        const err = new Error("Email not verified")
        err.statusCode = 401
        throw err
    }

    //generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // store refresh token in Redis
    const redisKey =
        AUTH_CONSTANTS.REDIS_REFRESH_TOKEN_PREFIX + user.id;

    await redis.set(
        redisKey,
        refreshToken,
        "EX",
        30*24*60 * 60
    )

    return {
        user,
        accessToken,
        refreshToken
    }

}

const logOutService= async(refreshToken)=>{
    if(!refreshToken){
        return
    }
    const decoded= jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
    )

    const userId=decoded.userId;
    // delete refresh token from redis
    const redisKey=AUTH_CONSTANTS.REDIS_REFRESH_TOKEN_PREFIX+userId

    await redis.del(redisKey);
}

// refreshtoken service

const refreshTokenService = async (refreshToken) => {
    try { //verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
        const userId = decoded.userId
        // check redis
        const redisKey = AUTH_CONSTANTS.REDIS_REFRESH_TOKEN_PREFIX + userId

        const storedToken = await redis.get(redisKey)
        if (!storedToken || storedToken !== refreshToken) {
            throw new Error("Invalid refresh token")
        }
        // rotation starts here
        // generate new access token
        const newAccessToken = jwt.sign(
            { userId },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY }
        )
        const newRefreshToken= jwt.sign(
            {userId},
            process.env.JWT_REFRESH_SECRET,
            {expiresIn:AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY}
        )

        // OVERWRITE REDIS
        await redis.set(
            redisKey,
            newRefreshToken,
            "EX",
            30*24*60*60
        )
        return {newAccessToken, newRefreshToken}
    } catch (error) {
        const err = new Error("Refresh token expery or invalid")
        err.statusCode = 401
        throw err
    }
}

export {
    signupService,
    loginService,
    refreshTokenService,
    logOutService
}
