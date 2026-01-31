import { Link } from "react-router-dom";

const FileList = ({ uploads, loading, error }) => {
  if (loading) return <p>Loading uploads...</p>;
  if (error) return <p className="text-error">{error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Your Files</h2>

      {uploads.length === 0 ? (
        <p>No uploads yet</p>
      ) : (
        <ul className="space-y-2">
          {uploads.map((u) => (
            <li
              key={u.id}
              className="p-3 bg-base-200 rounded flex justify-between items-center"
            >
              {/* FILE INFO */}
              <div>
                <div className="font-medium">
                  {u.original_filename}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(u.uploaded_at).toLocaleString()}
                </div>
              </div>

              {/* 👉 ANALYZE LINK */}
              <Link
                to={`/analysis/${u.id}`}
                className="text-blue-600 hover:underline font-medium"
              >
                Analyze →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
