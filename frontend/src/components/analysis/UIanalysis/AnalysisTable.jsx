const AnalysisTable = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  // 🔹 Detect columns dynamically
  const firstRow = data[0];

  // Case 3: Date + breakdown
  if (firstRow.breakdown) {
    return (
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) =>
              row.breakdown.map((item, idx) => (
                <tr key={`${row.date}-${idx}`}>
                  <td className="border p-2">{row.date}</td>
                  <td className="border p-2">{item.category}</td>
                  <td className="border p-2">₹ {item.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // Case 1 & 2: Category or Date
  const headers = Object.keys(firstRow);

  return (
    <div className="bg-white p-4 rounded shadow overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((key) => (
              <th key={key} className="border p-2 capitalize">
                {key.replace("_", " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((key) => (
                <td key={key} className="border p-2">
                  {typeof row[key] === "number"
                    ? `₹ ${row[key]}`
                    : row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnalysisTable;
