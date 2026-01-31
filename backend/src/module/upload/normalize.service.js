import { pool } from "../../config/db.js";
import format from "pg-format";

/* 
   Utility: detect format
 */
const detectFormat = (row) => {
  const numericKeys = Object.entries(row).filter(([_, v]) => !isNaN(v));
  return numericKeys.length > 1 ? "WIDE" : "LONG";
};

/* 
   Utility: detect date key
*/
const findDateKey = (row) => {
  return (
    Object.keys(row).find((k) => !isNaN(Date.parse(row[k]))) ||
    Object.keys(row)[0]
  );
};

/*
   Utility: normalize date
 */
const normalizeDate = (val) => {
  if (!val) return null;

  if (!isNaN(Date.parse(val))) {
    return new Date(val).toISOString().split("T")[0];
  }

  const match = String(val).match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (match) {
    const [, dd, mm, yyyy] = match;
    return `${yyyy}-${mm}-${dd}`;
  }

  return null;
};

/*
   MAIN NORMALIZATION (OPTIMIZED, SAME RESULT)
 */
export const normalizeUpload = async ({ uploadId, userId }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT row_data FROM file_records WHERE file_id = $1`,
      [uploadId]
    );

    if (!rows.length) throw new Error("No data");

    // 🔥 collect all inserts here
    const transactions = [];

    for (const r of rows) {
      const row = r.row_data;

      const dateKey = findDateKey(row);
      const date = normalizeDate(row[dateKey]);
      if (!date) continue;

      const formatType = detectFormat(row);

      // WIDE FORMAT
      if (formatType === "WIDE") {
        for (const [key, value] of Object.entries(row)) {
          if (key === dateKey) continue;
          if (isNaN(value)) continue;

          transactions.push([
            userId,
            uploadId,
            date,
            Math.abs(Number(value)),
            "expense",
            key,
            JSON.stringify(row),
          ]);
        }
      }

      // LONG FORMAT
      else {
        const entries = Object.entries(row).filter(([_, v]) => !isNaN(v));
        if (!entries.length) continue;

        const [key, value] = entries[0];

        transactions.push([
          userId,
          uploadId,
          date,
          Math.abs(Number(value)),
          Number(value) >= 0 ? "income" : "expense",
          key,
          JSON.stringify(row),
        ]);
      }
    }

    // 🔥 ONE SINGLE INSERT (instead of thousands)
    if (transactions.length > 0) {
      const insertQuery = format(
        `
        INSERT INTO transactions
        (user_id, upload_id, date, amount, direction, category, raw)
        VALUES %L
        `,
        transactions
      );

      await client.query(insertQuery);
    }

    await client.query(
      `UPDATE uploaded_files SET is_normalized = true WHERE id = $1`,
      [uploadId]
    );

    await client.query("COMMIT");

    return { success: true };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};




// import { pool } from "../../config/db.js";

// /* 
//    Utility: detect format
//  */
// const detectFormat = (row) => {
//   const numericKeys = Object.entries(row)
//     .filter(([_, v]) => !isNaN(v));

//   return numericKeys.length > 1 ? "WIDE" : "LONG";
// };

// /* 
//    Utility: detect date key
// */
// const findDateKey = (row) => {
//   return Object.keys(row).find(
//     k => !isNaN(Date.parse(row[k]))
//   ) || Object.keys(row)[0]; // fallback: first column
// };

// /*
//    Utility: normalize date
//  */
// const normalizeDate = (val) => {
//   if (!val) return null;

//   // ISO / JS-parseable formats
//   if (!isNaN(Date.parse(val))) {
//     return new Date(val).toISOString().split("T")[0];
//   }

//   // DD-MM-YYYY or DD/MM/YYYY
//   const match = String(val).match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
//   if (match) {
//     const [, dd, mm, yyyy] = match;
//     return `${yyyy}-${mm}-${dd}`;
//   }

//   return null;
// };

// /*
//    Main normalization
//  */

// export const normalizeUpload = async ({ uploadId, userId }) => {
//   // console.log("NORMALIZATION STARTED", uploadId);

//   const client = await pool.connect();
//   // console.log("hi")
//   try {
//     await client.query("BEGIN");

//     const { rows } = await client.query(
//       `SELECT row_data FROM file_records WHERE file_id = $1`,
//       [uploadId]
//     );

//     if (!rows.length) throw new Error("No data");

//     for (const r of rows) {
//       const row = r.row_data;

//       const dateKey = findDateKey(row);
//       const date = normalizeDate(row[dateKey]);
//       if (!date) continue;

//       const format = detectFormat(row);

//       //WIDE FORMAT → expense only
//       if (format === "WIDE") {
//         for (const [key, value] of Object.entries(row)) {
//           if (key === dateKey) continue;
//           if (isNaN(value)) continue;

//           await client.query(
//             `
//             INSERT INTO transactions
//               (user_id, upload_id, date, amount, direction, category, raw)
//             VALUES ($1,$2,$3,$4,$5,$6,$7)
//             `,
//             [
//               userId,
//               uploadId,
//               date,
//               Math.abs(Number(value)),
//               "expense",
//               key,      // EXACT column name as category
//               row
//             ]
//           );
//         }
//       }

//       //LONG FORMAT → single amount
//       else {
//         const entries = Object.entries(row)
//           .filter(([_, v]) => !isNaN(v));

//         if (!entries.length) continue;

//         const [key, value] = entries[0];

//         await client.query(
//           `
//           INSERT INTO transactions
//             (user_id, upload_id, date, amount, direction, category, raw)
//           VALUES ($1,$2,$3,$4,$5,$6,$7)
//           `,
//           [
//             userId,
//             uploadId,
//             date,
//             Math.abs(Number(value)),
//             Number(value) >= 0 ? "income" : "expense",
//             key,
//             row
//           ]
//         );
//       }
//     }

//     await client.query(
//       `UPDATE uploaded_files SET is_normalized = true WHERE id = $1`,
//       [uploadId]
//     );

//     await client.query("COMMIT");

//     return { success: true };

//   } catch (err) {
//     await client.query("ROLLBACK");
//     throw err;
//   } finally {
//     client.release();
//   }
// };
