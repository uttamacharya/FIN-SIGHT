import { pool } from "../../config/db.js";

/* 
   SUMMARY (overall)
*/
export const getSummaryAnalysis = async ({ uploadId, userId }) => {
  const { rows } = await pool.query(
    `
    SELECT
      COALESCE(SUM(CASE WHEN direction='expense' THEN amount END),0) AS total_expense,
      COALESCE(SUM(CASE WHEN direction='income' THEN amount END),0) AS total_income,
      COALESCE(SUM(CASE WHEN direction='income' THEN amount END),0)
      -
      COALESCE(SUM(CASE WHEN direction='expense' THEN amount END),0)
      AS net_balance
    FROM transactions
    WHERE upload_id=$1 AND user_id=$2
    `,
    [uploadId, userId]
  );

  return rows[0];
};

/* 
  CATEGORY WISE (all time)
*/
export const getCategoryAnalysis = async ({ uploadId, userId }) => {
  const { rows } = await pool.query(
    `
    SELECT category, SUM(amount) AS total_amount
    FROM transactions
    WHERE upload_id=$1 AND user_id=$2
    GROUP BY category
    ORDER BY total_amount DESC
    `,
    [uploadId, userId]
  );

  return rows;
};

/*
  DATE RANGE (total per date)
*/
export const getDateRangeAnalysis = async ({
  uploadId,
  userId,
  from,
  to
}) => {
  const { rows } = await pool.query(
    `
    SELECT date, SUM(amount) AS total_amount
    FROM transactions
    WHERE upload_id=$1
      AND user_id=$2
      AND date BETWEEN $3 AND $4
    GROUP BY date
    ORDER BY date ASC
    `,
    [uploadId, userId, from, to]
  );

  return rows;
};

/* 
  SINGLE DATE + CATEGORY
  "is date ko kaha kitna hua"
*/
export const getDateCategoryAnalysis = async ({
  uploadId,
  userId,
  date
}) => {
  const { rows } = await pool.query(
    `
    SELECT category, SUM(amount) AS total_amount
    FROM transactions
    WHERE upload_id=$1
      AND user_id=$2
      AND date=$3
    GROUP BY category
    ORDER BY total_amount DESC
    `,
    [uploadId, userId, date]
  );

  return rows;
};

/* 
   DATE RANGE + CATEGORY
  "is date ke beech kaha kitna hua"
*/
export const getDateRangeCategoryAnalysis = async ({
  uploadId,
  userId,
  from,
  to
}) => {
  const { rows } = await pool.query(
    `
    SELECT
      date,
      json_agg(
        json_build_object(
          'category', category,
          'amount', total_amount
        )
        ORDER BY category
      ) AS breakdown,
      SUM(total_amount) AS total
    FROM (
      SELECT
        date::date AS date,
        category,
        SUM(amount) AS total_amount
      FROM transactions
      WHERE upload_id = $1
        AND user_id = $2
        AND date BETWEEN $3 AND $4
      GROUP BY date::date, category
    ) t
    GROUP BY date
    ORDER BY date;
    `,
    [uploadId, userId, from, to]
  );

  return rows;
};

/* 
   MULTI CATEGORY FILTER
  "food + travel + rent"
*/
export const getMultiCategoryAnalysis = async ({
  uploadId,
  userId,
  categories
}) => {
  const { rows } = await pool.query(
    `
    SELECT category, SUM(amount) AS total_amount
    FROM transactions
    WHERE upload_id=$1
      AND user_id=$2
      AND category = ANY($3)
    GROUP BY category
    ORDER BY total_amount DESC
    `,
    [uploadId, userId, categories]
  );

  return rows;
};

/* 
  DATE + MULTI CATEGORY
 */
export const getDateMultiCategoryAnalysis = async ({
  uploadId,
  userId,
  date,
  categories
}) => {
  const { rows } = await pool.query(
    `
    SELECT category, SUM(amount) AS total_amount
    FROM transactions
    WHERE upload_id=$1
      AND user_id=$2
      AND date=$3
      AND category = ANY($4)
    GROUP BY category
    `,
    [uploadId, userId, date, categories]
  );

  return rows;
};

/* 
   DATE RANGE + MULTI CATEGORY
*/
export const getDateRangeMultiCategoryAnalysis = async ({
  uploadId,
  userId,
  from,
  to,
  categories
}) => {
  const { rows } = await pool.query(
    `
    SELECT category, SUM(amount) AS total_amount
    FROM transactions
    WHERE upload_id=$1
      AND user_id=$2
      AND date BETWEEN $3 AND $4
      AND category = ANY($5)
    GROUP BY category
    `,
    [uploadId, userId, from, to, categories]
  );

  return rows;
};

/* 
   METADATA (UI + cache)
*/
export const getAnalysisMetadata = async ({ uploadId, userId }) => {
  const { rows } = await pool.query(
    `
    SELECT
      MIN(date) AS start_date,
      MAX(date) AS end_date,
      ARRAY_AGG(DISTINCT category) AS categories
    FROM transactions
    WHERE upload_id=$1 AND user_id=$2
    `,
    [uploadId, userId]
  );

  return rows[0];
};
