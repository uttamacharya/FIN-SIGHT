import {
  getSummaryAnalysis,
  getCategoryAnalysis,
  getDateRangeAnalysis,
  getDateCategoryAnalysis,
  getDateRangeCategoryAnalysis,
  getMultiCategoryAnalysis,
  getDateMultiCategoryAnalysis,
  getDateRangeMultiCategoryAnalysis,
  getAnalysisMetadata
} from "./analysis.service.js";

import {
  withAnalysisCache
} from "./analysis.cache.js";

/* 
   SUMMARY CONTROLLER
*/
export const summaryController = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    const userId = req.user.id;

    const data = await withAnalysisCache({
      keyBase: `analysis:${userId}:${uploadId}:summary`,
      params: {},
      fetcher: () =>
        getSummaryAnalysis({ uploadId, userId })
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
};

/* 
   CATEGORY CONTROLLER
*/
export const categoryController = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    const userId = req.user.id;

    const data = await withAnalysisCache({
      keyBase: `analysis:${userId}:${uploadId}:category`,
      params: {},
      fetcher: () =>
        getCategoryAnalysis({ uploadId, userId })
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
};

/*
   DATE RANGE CONTROLLER
*/
export const dateRangeController = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    const { from, to } = req.query;
    const userId = req.user.id;

    const data = await withAnalysisCache({
      keyBase: `analysis:${userId}:${uploadId}:date-range`,
      params: { from, to },
      fetcher: () =>
        getDateRangeAnalysis({ uploadId, userId, from, to })
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
};

/*
   SINGLE DATE + CATEGORY
*/
export const dateCategoryController = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    const { date } = req.query;
    const userId = req.user.id;

    const data = await withAnalysisCache({
      keyBase: `analysis:${userId}:${uploadId}:date-category`,
      params: { date },
      fetcher: () =>
        getDateCategoryAnalysis({ uploadId, userId, date })
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
};

/*
   DATE RANGE + CATEGORY
*/
export const dateRangeCategoryController = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    const { from, to } = req.query;
    const userId = req.user.id;

    const data = await withAnalysisCache({
      keyBase: `analysis:${userId}:${uploadId}:date-range-category`,
      params: { from, to },
      fetcher: () =>
        getDateRangeCategoryAnalysis({ uploadId, userId, from, to })
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
};

/* 
   MULTI CATEGORY
*/
export const multiCategoryController = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    const { categories } = req.body;
    const userId = req.user.id;

    const data = await withAnalysisCache({
      keyBase: `analysis:${userId}:${uploadId}:multi-category`,
      params: { categories },
      fetcher: () =>
        getMultiCategoryAnalysis({
          uploadId,
          userId,
          categories
        })
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
};

/*
   DATE + MULTI CATEGORY
*/
export const dateMultiCategoryController = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    const { date, categories } = req.body;
    const userId = req.user.id;

    const data = await withAnalysisCache({
      keyBase: `analysis:${userId}:${uploadId}:date-multi-category`,
      params: { date, categories },
      fetcher: () =>
        getDateMultiCategoryAnalysis({
          uploadId,
          userId,
          date,
          categories
        })
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
};

/*
   DATE RANGE + MULTI CATEGORY */
export const dateRangeMultiCategoryController = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    const { from, to, categories } = req.body;
    const userId = req.user.id;

    const data = await withAnalysisCache({
      keyBase: `analysis:${userId}:${uploadId}:date-range-multi-category`,
      params: { from, to, categories },
      fetcher: () =>
        getDateRangeMultiCategoryAnalysis({
          uploadId,
          userId,
          from,
          to,
          categories
        })
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
};

/*
   METADATA CONTROLLER*/
export const metadataController = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    const userId = req.user.id;

    const data = await withAnalysisCache({
      keyBase: `analysis:${userId}:${uploadId}:metadata`,
      params: {},
      fetcher: () =>
        getAnalysisMetadata({ uploadId, userId })
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
};
