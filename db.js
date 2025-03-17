import Database from "better-sqlite3";

// Initialize SQLite database (or create if it doesn't exist)
const db = new Database("users.db", { verbose: console.log });

// Create the users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  )
`);

// Function to insert a new user
export const signupUser = ({ username, email, password, role }) => {
  try {
    const stmt = db.prepare(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(username, email, password, role);
    return { success: true, id: result.lastInsertRowid };
  } catch (error) {
    console.error("Signup Error:", error.message);
    return { success: false, error: error.message };
  }
};

// Function to fetch all users (for testing)
export const getUsers = () => {
  return db.prepare("SELECT * FROM users").all();
};
