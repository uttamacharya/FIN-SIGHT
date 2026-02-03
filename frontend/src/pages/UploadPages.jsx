import { useState } from "react";
import UploadModel from "../components/uploads/UploadModel";
import FileList from "../components/uploads/FileList";
import { useUploads } from "../hooks/useUpload";

function UploadPages() {
  const uploadsState = useUploads();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 max-w-[95%] mx-auto bg-slate-300 s">
      {/* Header action */}
      <div className="flex justify-between items-center mb-6 p-6 shadow-md hover:shadow-lg bg-slate-50 rounded-lg ">
        <h1 className="text-4xl font-bold text-gray-950">File Analysis Dashboard</h1>
        <button
          className="btn btn-primary"
          onClick={() => setOpen(true)}
        >
          + Upload File
        </button>
      </div>

      {/* File list */}
      <FileList
        uploads={uploadsState.uploads}
        loading={uploadsState.loading}
        error={uploadsState.error}
        onDelete={uploadsState.deleteFile}
      />

      {/* Upload modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <UploadModel
              uploadFile={uploadsState.uploadFile}
              loading={uploadsState.loading}
            />
            <button
              onClick={() => setOpen(false)}
              className="btn btn-sm mt-4 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPages;
