import { useState } from "react";
import { useAuth } from "../hooks/UseAuth";
import { useUploads } from "../hooks/useUpload";
import UploadModel from "../components/uploads/UploadModel";
import FileList from "../components/uploads/FileList";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { uploads, loading, error, uploadFile, deleteFile } = useUploads();

  const [open, setOpen] = useState(false);

  //  Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Please login to continue
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[95%] mx-auto bg-slate-300 min-h-screen">

      {/*HEADER (ALWAYS VISIBLE) */}
      <div className="flex justify-between items-center mb-6 p-6 bg-slate-50 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-950">
          FinSight Dashboard
        </h1>

        <button
          className="btn btn-primary"
          onClick={() => setOpen(true)}
        >
          + Upload File
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center mt-20">
          <p>Loading...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center text-red-500 mt-10">
          {error}
        </div>
      )}

      {/* 📭 EMPTY STATE */}
      {!loading && uploads.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24 gap-4">
          <h2 className="text-3xl font-bold">
            Welcome to FinSight
          </h2>
          <p className="text-gray-600 text-center max-w-md">
            Upload your first file to start analyzing expenses,
            profit, loss, and trends.
          </p>
        </div>
      )}

      {/* FILE LIST */}
      {!loading && uploads.length > 0 && (
        <FileList
          uploads={uploads}
          loading={loading}
          error={error}
          onDelete={deleteFile}
        />
      )}

      {/* UPLOAD MODAL (GLOBAL) */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <UploadModel
              uploadFile={uploadFile}
              loading={loading}
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
};

export default Home;
