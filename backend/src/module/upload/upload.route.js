import express from 'express'
import {
    deleteUpload,
    getUploadById,
    getUploadRecords,
    getUploads,
    uploadController
} from './upload.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'
import { uploadMiddleware } from '../../middlewares/upload.middleware.js'
const router = express.Router()

router.post(
    "/",
    authMiddleware,
    uploadMiddleware,   // multer YAHAN
    uploadController
)

router.get(
    "/",
    authMiddleware,
    getUploads
)

router.get(
    "/:id/records",
    authMiddleware,
    getUploadRecords
)

router.get(
    "/:id",
    authMiddleware,
    getUploadById
)


router.delete(
    "/:id",
    authMiddleware,
    deleteUpload
)

export default router;