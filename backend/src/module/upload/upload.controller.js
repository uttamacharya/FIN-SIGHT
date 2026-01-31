// import { success } from "zod";
import { uploadService } from "./upload.service.js";



export const uploadController = async (req, res) => {
    try {
        // from auth middleware
        const userId = req.user?.id
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "unauthorized user"
            });

        }
        // multer se file milta hai
        const file = req.file
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "File required"
            })
        }

        // now call service
        const result = await uploadService.uploadFile({
            userId,
            file
        })
        return res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "File not uploaded"
        })
    }
}

export const getUploads = async (req, res, next) => {
    try {
        const uploads = await uploadService.getUserUploads(req.user.id)
        return res.status(200).json({
            success: true,
            data: uploads
        })
    } catch (error) {
        next(error)
    }
}

// get single upload metadata

export const getUploadById = async (req, res, next) => {
    try {
        const userId = req.user.id
        const id = req.params.id
        const upload = await uploadService.getUploadById(id, userId)
        return res.status(200).json({
            success: true,
            data: upload
        })
    } catch (error) {
        next(error)
    }
}
export const getUploadRecords = async (req, res, next) => {
    try {
        const userId = req.user.id
        const id = req.params.id
        const upload = await uploadService.getUploadRecords(id, userId)
        return res.status(200).json({
            success: true,
            data: upload
        })
    } catch (error) {
        next(error)
    }
}

export const deleteUpload = async (req, res, next) => {
    try {
        const userId = req.user.id
        const id = req.params.id
        await uploadService.deleteUpload(id, userId)
        return res.status(200).json({
            success: true,
            message: "File delete successfully"
        })
    } catch (error) {
        next(error)
    }
}