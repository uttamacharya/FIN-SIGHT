import { useState } from "react"
// import { useUploads } from "../../hooks/useUpload"

function UploadModel({ uploadFile, loading }) {
  // const {uploadFile, loading}=useUploads();
  const [file, setFile] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return
    await uploadFile(file)
    setFile(null)
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Upload File</h2>

        <input
          type="file"
          className="file-input file-input-bordered w-full"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

    </>
  )
}

export default UploadModel