import { DATE_MODE, CHART_TYPE } from "../analysis.constant.js";

const Filters = ({
  metadata,
  filters,
  setFilters,
  onRun,
  loading
}) => {

  if (!metadata) {
    return <div className="text-gray-500">Loading filters...</div>;
  }

  const handleDateModeChange = (e) => {
    const mode = e.target.value;
    setFilters({
      ...filters,
      dateMode: mode,
      from: null,
      to: null,
      date: null
    });
  };

  const toggleCategory = (category) => {
    const exists = filters.categories.includes(category);

    setFilters({
      ...filters,
      categories: exists
        ? filters.categories.filter(c => c !== category)
        : [...filters.categories, category]
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">

      {/* DATE MODE */}
      <div>
        <label className="block font-medium">Date Mode</label>
        <select
          value={filters.dateMode}
          onChange={handleDateModeChange}
          className="border p-2 rounded w-full"
        >
          <option value={DATE_MODE.NONE}>None</option>
          <option value={DATE_MODE.SINGLE}>Single Date</option>
          <option value={DATE_MODE.RANGE}>Date Range</option>
        </select>
      </div>

      {/* SINGLE DATE */}
      {filters.dateMode === DATE_MODE.SINGLE && (
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={filters.date || ""}
          onChange={(e) =>
            setFilters({ ...filters, date: e.target.value })
          }
        />
      )}

      {/* DATE RANGE */}
      {filters.dateMode === DATE_MODE.RANGE && (
        <div className="flex gap-2">
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={filters.from || ""}
            onChange={(e) =>
              setFilters({ ...filters, from: e.target.value })
            }
          />
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={filters.to || ""}
            onChange={(e) =>
              setFilters({ ...filters, to: e.target.value })
            }
          />
        </div>
      )}

      {/* CATEGORY */}
      <div>
        <label className="block font-medium mb-1">Categories</label>
        <div className="flex flex-wrap gap-2">
          {metadata.categories?.map((cat) => (
            <label key={cat} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* CHART TYPE */}
      <div>
        <label className="block font-medium">Chart Type</label>
        <select
          value={filters.chartType}
          onChange={(e) =>
            setFilters({ ...filters, chartType: e.target.value })
          }
          className="border p-2 rounded w-full"
        >
          {Object.values(CHART_TYPE).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* RUN BUTTON */}
      <button
        disabled={loading}
        onClick={onRun}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Run Analysis
      </button>

    </div>
  );
};

export default Filters;
