import { pool } from "../../config/db.js"

// Create new user
const createUser = async ({ name, email, password, is_email_verified }) => {
    const query = `
      INSERT INTO users(name, email, password, is_email_verified)
      VALUES($1, $2, $3, $4)
      RETURNING id, name, email, is_email_verified, created_at
    `
    const values = [name, email, password, is_email_verified]
    const { rows } = await pool.query(query, values)
    return rows[0]
}

// Find user by email

const findUserByEmail = async (email) => {
    const query = `
       SELECT * FROM users
       WHERE email=$1
    `
    const { rows } = await pool.query(query, [email])
    return rows[0];
}

// Find user by id->for profile and middlewere

const findUserById = async (id) => {
    const query = `
       SELECT * FROM users
       WHERE id=$1
    `
    const { rows } = await pool.query(query, [id])
    return rows[0];
}

// verify email
const verifyUserEmail = async (userId) => {
    const query = `
       UPDATE users
       SET is_email_verified=true,
         updated_at= now()
       WHERE id=$1
       RETURNING id, email, is_verified
    `
    const { rows } = await pool.query(query, [userId])
    return rows[0]
}

// Update user password

const updateUserPassword = async (email, newPassword) => {
    const query = `
        UPDATE users
        SET password= $1,
          updated_at=now()
        WHERE email= $2
        RETURNING id, email
    `
    const { rows } = await pool.query(query, [newPassword, email])
    return rows[0]
}

export {
    createUser,
    findUserByEmail,
    findUserById,
    updateUserPassword,
    verifyUserEmail
}





// iska beast version upar hai
// const result = await pool.query(
//   "INSERT INTO tasks (title, status, student_id) VALUES ($1,$2,$3) RETURNING *",
//   [title, status, student_id]
// );
// return result.rows[0];
