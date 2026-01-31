import { pool } from "../src/config/db.js";

const initDb = async () => {
  try {
    // users 
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    //uploaded_files
    await pool.query(`
      CREATE TABLE IF NOT EXISTS uploaded_files (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        original_filename TEXT NOT NULL,
        file_type VARCHAR(20),
        uploaded_at TIMESTAMPTZ DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // file_records
    await pool.query(`
      CREATE TABLE IF NOT EXISTS file_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        file_id UUID NOT NULL,
        row_data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        FOREIGN KEY (file_id) REFERENCES uploaded_files(id) ON DELETE CASCADE
      );
    `);


    await pool.query(
      `
        CREATE TABLE IF NOT EXISTS transactions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

           user_id UUID NOT NULL
           REFERENCES users(id) ON DELETE CASCADE,

           upload_id UUID NOT NULL
           REFERENCES uploaded_files(id) ON DELETE CASCADE,

           -- normalized fields
           date DATE NOT NULL,
           amount NUMERIC NOT NULL CHECK (amount >= 0),
           direction TEXT NOT NULL CHECK (direction IN ('income', 'expense')),
           category TEXT,
           description TEXT,

           -- original raw row (VERY IMPORTANT)
           raw JSONB NOT NULL,

           created_at TIMESTAMPTZ DEFAULT NOW()
         );


      `
    )

    console.log(" All tables ready");
    process.exit(0);
  } catch (error) {
    console.error(" DB init failed", error);
    process.exit(1);
  }
};

initDb();
