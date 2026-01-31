import { pool } from "../../config/db.js";
import { parseFile } from "./upload.parser.js";
import { normalizeUpload } from "./normalize.service.js";



export const uploadService = {
    async uploadFile({ userId, file }) {
        const client = await pool.connect()

        try {
            await client.query('BEGIN')
            const insertFileQuery = `
               INSERT INTO uploaded_files(user_id, original_filename, file_type)
               VALUES ($1, $2, $3)
               RETURNING id
            `
            const fileValues = [
                userId,
                file.originalname,
                file.mimetype
            ]

            const { rows: fileRows } = await client.query(
             insertFileQuery, fileValues
            )

            const fileId = fileRows[0].id

            // parse file

            const parsedRows = await parseFile(file)

            if (!parsedRows || parsedRows.length === 0) {
                throw new Error("Uploaded file has no valid data")
            }

            // store raw rows in file record

            const insertRawQuery = `
               INSERT INTO file_records(file_id, row_data)
               SELECT $1, jsonb_array_elements($2::jsonb)
            `

            await client.query(insertRawQuery, [
                fileId,
                JSON.stringify(parsedRows)
            ])


            await client.query('COMMIT')
            //commit raw upload

            // normalize (outside transaction – IMPORTANT)
            // console.log("NORMALIZATION STARTED", uploadId);

            try {
                await normalizeUpload({
                    uploadId: fileId,
                    userId,

                });
            } catch (normalizeError) {
                console.error(
                    "Normalization failed for upload:",
                    fileId,
                    normalizeError.message
                );
                // upload is still valid, normalize can be retried
            }

            return {
                fileId,
                totalRows: parsedRows.length,
                message: " file uploaded and raw data store successfully"
            }
        } catch (error) {
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
    },


    async getUserUploads(userId) {
        const query = `
          SELECT 
          id, original_filename, file_type, uploaded_at
          FROM uploaded_files
          WHERE user_id= $1
          ORDER BY uploaded_at DESC
        `
        const { rows } = await pool.query(query, [userId])
        return rows
    },

    async getUploadById(uploadId, userId) {
        const query = `
          SELECT 
          id, original_filename, file_type, uploaded_at
           FROM uploaded_files
          WHERE id= $1 AND user_id=$2
        `
        const { rows } = await pool.query(query, [uploadId, userId])
        if (rows.length === 0) {
            throw new Error("Upload not found")
        }
        return rows[0]
    },

    // get raw rows of upload file

    async getUploadRecords(uploadId, userId) {
        const query = `
           SELECT fr.row_data
           FROM file_records fr
           JOIN uploaded_files uf 
           ON uf.id =fr.file_id
           where fr.file_id =$1 AND uf.user_id=$2
           ORDER BY fr.id ASC
        `

        const { rows } = await pool.query(query, [uploadId, userId])
        return rows.map(r => r.row_data)
    },


    async deleteUpload(uploadedId, userId) {
        const { rowCount } = await pool.query(
            `
               DELETE FROM uploaded_files
               WHERE id = $1 AND user_id = $2
            `,
            [uploadedId, userId]
        )

        if (rowCount === 0) {
            throw new Error("Upload not found or not authorized")
        }

        return true
    }

}


