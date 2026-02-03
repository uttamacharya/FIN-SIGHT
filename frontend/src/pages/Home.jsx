import { useAuth } from "../hooks/UseAuth";
import { useUploads } from "../hooks/useUpload";
import UploadPages from "./UploadPages";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { uploads, loading } = useUploads();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Please login to continue
        </p>
      </div>
    );
  }

  //  loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  //NO FILES → Welcome screen
  if (uploads.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-300">
        <h1 className="text-3xl font-bold">
          Welcome to FinSight 
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          Upload your first file to start analyzing expenses,
          profit, loss, and trends.
        </p>
      </div>
    );
  }

  //FILES EXIST → Dashboard
  return <UploadPages />;
};

export default Home;
