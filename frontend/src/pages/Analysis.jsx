import { useState } from "react";
import {useParams} from 'react-router-dom'

import { useAnalysis } from "../hooks/useAnalysis";

import Filters from "../components/analysis/UIanalysis/Filters";
import SummaryCards from "../components/analysis/UIanalysis/SummaryCards";
import AnalysisChart from "../components/analysis/UIanalysis/AnalysisChart";
import AnalysisTable from "../components/analysis/UIanalysis/AnalysisTable";

const Analysis = () => {
  const {uploadId}= useParams();
  const {
    metadata,
    filters,
    setFilters,
    result,
    loading,
    error,
    runAnalysis
  } = useAnalysis(uploadId);

  if (!uploadId) {
    return (
      <div className="p-6 text-gray-500">
        Please select a file to analyze.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* FILTERS */}
      <Filters
        metadata={metadata}
        filters={filters}
        setFilters={setFilters}
        onRun={runAnalysis}
        loading={loading}
      />

      {/* ERROR */}
      {error && (
        <div className="text-red-600 bg-red-100 p-3 rounded">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-gray-500">
          Running analysis...
        </div>
      )}

      {/* RESULTS */}
      {result && !loading && (
        <>
          {/* Summary (if object) */}
          {typeof result === "object" && !Array.isArray(result) && (
            <SummaryCards data={result} />
          )}

          {/* Chart */}
          {Array.isArray(result) && (
            <AnalysisChart data={result} chartType={filters.chartType} />
          )}

          {/* Table */}
          {Array.isArray(result) && (
            <AnalysisTable data={result} />
          )}
        </>
      )}
    </div>
  );
};

export default Analysis;
