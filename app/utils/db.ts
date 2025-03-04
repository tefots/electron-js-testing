import Database from 'better-sqlite3';

const db = new Database('./database.db', { verbose: console.log });

// Create the "products" table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productName TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    imagePath TEXT
  )
`).run();   

export default db;
