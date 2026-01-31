import { ANALYSIS_TYPE } from "./analysis.constant";

import {
     getSummary,
     getCategory,
     getMultiCategory,
     getDateCategory,
     getDateRange,
     getDateRangeCategory,
     getDateRangeMultiCategory,
     getDateMultiCategory,
} from '../../api/analysis.api.js'

export const analysisMapper = {
  [ANALYSIS_TYPE.SUMMARY]: getSummary,

  [ANALYSIS_TYPE.CATEGORY]: getCategory,
  [ANALYSIS_TYPE.MULTI_CATEGORY]: getMultiCategory,

  [ANALYSIS_TYPE.DATE_CATEGORY]: getDateCategory,
  [ANALYSIS_TYPE.DATE_RANGE]: getDateRange,
  [ANALYSIS_TYPE.DATE_RANGE_CATEGORY]: getDateRangeCategory,
  [ANALYSIS_TYPE.DATE_RANGE_MULTI_CATEGORY]:getDateRangeMultiCategory,
  [ANALYSIS_TYPE.DATE_MULTI_CATEGORY]: getDateMultiCategory
};