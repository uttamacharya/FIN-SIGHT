// sab fiexd value (experies cokkie name) aur we can say that avoid magic number -> token expery time limit


export const AUTH_CONSTANTS= {
    // jwt expery time
    ACCESS_TOKEN_EXPIRY: "7d",
    REFRESH_TOKEN_EXPIRY: "30d",

    // redis key prefix (evoid collison)
    REDIS_REFRESH_TOKEN_PREFIX: "auth:refresh",
    REDIS_EMAIL_VERIFY_PREFIX: "auth:verify",
    REDIS_RESET_PASSWORD_PREFIX: "auth:reset",

    // redis expery

    EMAIL_VERIFY_TOKEN_TTL: 15*60,
    RESET_PASSWORD_TOKEN_TTL: 10*60,

    // PASSWORD HASING
    PASSWORD_SALT_ROUND: 10,

    // COOKIES NAME->IF USE COKKIES 
    ACCESS_TOKEN_COOKIE:"access_token",
    REFRESH_TOKEN_COOKIE: "refresh_token"
}