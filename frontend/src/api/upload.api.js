import api from "./axios"

// file upload

export const uploadFileApi=(formData)=>{
    return api.post("/upload", formData, {
        headers: {"content-Type":"multipart/form-data"}
    })
};


export const getUploadApi=()=>{
    return api.get("/upload");
}


export const deleteApi=(uploadId)=>{
    return api.delete(`/upload/${uploadId}`)
}