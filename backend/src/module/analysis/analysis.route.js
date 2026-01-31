import express from "express";
import {
  summaryController,
  categoryController,
  dateRangeController,
  dateCategoryController,
  dateRangeCategoryController,
  multiCategoryController,
  dateMultiCategoryController,
  dateRangeMultiCategoryController,
  metadataController
} from "./analysis.controller.js";

const router = express.Router();

router.get("/:uploadId/summary", summaryController);
router.get("/:uploadId/category", categoryController);
router.get("/:uploadId/date-range", dateRangeController);
router.get("/:uploadId/date-category", dateCategoryController);
router.get("/:uploadId/date-range-category", dateRangeCategoryController);

router.post("/:uploadId/multi-category", multiCategoryController);
router.post("/:uploadId/date-multi-category", dateMultiCategoryController);
router.post("/:uploadId/date-range-multi-category", dateRangeMultiCategoryController);

router.get("/:uploadId/metadata", metadataController);

export default router;
