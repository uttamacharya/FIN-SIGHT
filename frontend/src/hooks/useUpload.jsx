import { useState } from "react"
import { uploadFileApi, getUploadApi } from "../api/upload.api"
import { useEffect } from "react";
import { toast } from "react-toastify";
export const useUploads = () => {
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);

    // fetch uploads on mount
    const fetchUploads = async () => {
        try {
            setLoading(true);
            const response = await getUploadApi();
            setUploads(response.data.data);
            setError(null);
        } catch (err) {
            const backendMessage =
                err.response?.data?.message || "Failed to fetch uploads";

            setError(backendMessage);
            toast.error(backendMessage);
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchUploads()
    }, [])

    const uploadFile = async (file) => {
        try {
            setLoading(true);
            const formData = new FormData()
            formData.append("file", file)
            const res=await uploadFileApi(formData)
            toast.success(res.data?.message || "Upload successful");
            await fetchUploads(); //refresh list
        } catch (err) {
            const backendMessage =
                err.response?.data?.message || "Upload failed";

            setError(backendMessage);
            toast.error(backendMessage);
        }
        finally {
            setLoading(false)
        }
    }

    return {
        uploads,
        loading,
        error,
        uploadFile,
        fetchUploads
    }
}