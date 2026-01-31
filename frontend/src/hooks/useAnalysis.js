import { useEffect, useState, useCallback } from "react";

import { decideAnalysisType } from "../components/analysis/analysis.decision";
import { analysisMapper } from "../components/analysis/analysis.Mapper";
import {
  DEFAULT_ANALYSIS_FILTER,
  ANALYSIS_TYPE
} from "../components/analysis/analysis.constant";

import { getMetadata } from "../api/analysis.api";

export const useAnalysis = (uploadId) => {
  //STATE
  const [metadata, setMetadata] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_ANALYSIS_FILTER);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FETCH METADAta
  useEffect(() => {
    if (!uploadId) return;

    setLoading(true);
    setError(null);

    getMetadata(uploadId)
      .then((res) => {
        setMetadata(res.data);
        setFilters(DEFAULT_ANALYSIS_FILTER); // reset filters on file change
      })
      .catch((err) => {
        setError(err.message || "Failed to load metadata");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [uploadId]);

  // RUN ANALYSIS 
  const runAnalysis = useCallback(async () => {
    if (!uploadId) return;

    const analysisType = decideAnalysisType(filters);

    if (analysisType === ANALYSIS_TYPE.INVALID) {
      setError("Invalid filter selection");
      return;
    }

    const apiFn = analysisMapper[analysisType];

    if (!apiFn) {
      setError("No API mapped for this analysis type");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let response;

      // API PARAM PASSING
      switch (analysisType) {
        case ANALYSIS_TYPE.SUMMARY:
        case ANALYSIS_TYPE.CATEGORY:
          response = await apiFn(uploadId);
          break;

        case ANALYSIS_TYPE.MULTI_CATEGORY:
          response = await apiFn(uploadId, filters.categories);
          break;

        case ANALYSIS_TYPE.DATE_CATEGORY:
          response = await apiFn(uploadId, filters.date);
          break;

        case ANALYSIS_TYPE.DATE_MULTI_CATEGORY:
          response = await apiFn(
            uploadId,
            filters.date,
            filters.categories
          );
          break;

        case ANALYSIS_TYPE.DATE_RANGE:
          response = await apiFn(uploadId, filters.from, filters.to);
          break;

        case ANALYSIS_TYPE.DATE_RANGE_CATEGORY:
          response = await apiFn(uploadId, filters.from, filters.to);
          break;

        case ANALYSIS_TYPE.DATE_RANGE_MULTI_CATEGORY:
          response = await apiFn(
            uploadId,
            filters.from,
            filters.to,
            filters.categories
          );
          break;

        default:
          throw new Error("Unsupported analysis type");
      }

      setResult(response.data);
    } catch (err) {
      setError(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  }, [uploadId, filters]);

  //RETURN TO UI 
  return {
    metadata,
    filters,
    setFilters,

    result,
    loading,
    error,

    runAnalysis
  };
};
