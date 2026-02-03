import { Link } from "react-router-dom";

const FileList = ({ uploads, loading, error, onDelete }) => {
  if (loading) return <p>Loading uploads...</p>;
  if (error) return <p className="text-error">{error}</p>;

  return (
    <div className="mt-6 min-h-screen shadow-lg">
      <div className="card card-body top-3 ">
        <h1 className="text-lg font-semibold mb-2 text-gray-900">File Manager</h1>
      </div>
      

      {uploads.length === 0 ? (
        <p>No uploads yet</p>
      ) : (
        <ul className="space-y-2">
          {uploads.map((u) => (
            <li
              key={u.id}
              className="p-4 rounded flex justify-between items-center bg-slate-100 hover:shadow-lg hover:bg-blue-200 hover:border-blue-500"
            >
              {/* file info */}
              <div>
                <div className="font-medium text-gray-950">
                  {u.original_filename}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(u.uploaded_at).toLocaleString()}
                </div>
              </div>

              {/*  analyze link */}
              <Link
                to={`/analysis/${u.id}`}
                className="text-blue-600 hover:underline font-medium"
              >
                Analyze →
              </Link>
              <button
               className="btn btn-warning"
               onClick={()=>{
                if(window.confirm("Are You sure you want to delete this file?")){
                  onDelete(u.id)
                }
               }}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
