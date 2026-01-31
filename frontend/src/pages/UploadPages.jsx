import UploadModel from '../components/uploads/UploadModel';
import FileList from '../components/uploads/FileList';
import { useUploads } from '../hooks/useUpload';

function UploadPages() {
  const uploadsState = useUploads(); // ✅ SINGLE SOURCE

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Uploads</h1>

      <UploadModel
        uploadFile={uploadsState.uploadFile}
        loading={uploadsState.loading}
      />

      <FileList
        uploads={uploadsState.uploads}
        loading={uploadsState.loading}
        error={uploadsState.error}
      />
    </div>
  );
}

export default UploadPages;
