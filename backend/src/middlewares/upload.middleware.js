import multer from "multer"
import path from "path"
import fs from "fs"

// ensure upload folder exists
const uploadDir = "uploads"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  }
})

// allow only csv, excel, json
const fileFilter = (req, file, cb) => {
  const allowedExt = [".csv", ".xlsx", ".xls", ".json"]
  const ext = path.extname(file.originalname).toLowerCase()

  if (allowedExt.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error("Only CSV, Excel and JSON files are allowed"))
  }
}

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
}).single("file")
