import { useState } from "react"
// import { useUploads } from "../../hooks/useUpload"

function UploadModel({uploadFile, loading}) {
    // const {uploadFile, loading}=useUploads();
    const [file, setFile]=useState(null);
    const handleSubmit= async(e)=>{
        e.preventDefault();
        if(!file) return
        await uploadFile(file)
        setFile(null)
    };
  return (
    <>
    <form onSubmit={handleSubmit} className="card p-4 bg-gray-100 shadow">
        <input 
         type="file"
         className="file-input file-input-bordered w-full"
         onChange={(e)=>setFile(e.target.files[0])}
          />

          <button
            type="submit"
            className="btn btn-primary mt-4"
            disabled={loading}>
                {loading ?  "uploading..." : "upload"}
            </button>
    </form>
    </>
  )
}

export default UploadModel