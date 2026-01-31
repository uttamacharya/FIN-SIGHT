import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  try {
    // read authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing"
      })
    }

    // extract token
    const token = authHeader.split(" ")[1]

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    )
    // console.log("🔑 DECODED TOKEN:", decoded)

    // attach user to request
    req.user = {
      id: decoded.userId
    }
    // console.log("👤 req.user.id:", req.user.id)

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    })
  }
}

export default authMiddleware
