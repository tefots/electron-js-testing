const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "mydb.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    return;
  }
  console.log("Connected to SQLite database.");

  // Define table schemas
  const tables = [
    {
      name: "users",
      query: `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Off',
        userType TEXT NOT NULL DEFAULT 'user',
        phoneNumber INTEGER NOT NULL
      )`,
    },
    {
      name: "products",
      query: `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productName TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        description TEXT,
        imageURL TEXT, 
        creationDate DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    },
    { dummy: `Items,Subtotal,Discount,Total,GST,PaymentMethod,
      AmountPaid,Change,CustomerNames,PhoneNumber,CardNumber,TransactionDate,LoggedInUser`,
      name: "transactions",
      query: `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Items INTEGER NOT NULL,
        Subtotal INTEGER NOT NULL,
        Discount INTEGER NOT NULL,
        TotalPrice REAL NOT NULL,
        GST INTEGER NOT NULL,
        PaymentMethod TEXT NOT NULL,
        AmountPaid REAL NOT NULL,
        Chnage INTEGER NOT NULL,
        CustomerNames TEXT,
        PhoneNumber INTEGER,
        CardNumber INTEGER,
        TransactionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        LoggeInUser INTEGER NOT NULL,
        FOREIGN KEY (LoggeInUser) REFERENCES users(id) ON DELETE CASCADE,

      )`,
      //        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
    },
  ];

  // Create tables sequentially to handle dependencies (e.g., transactions references users, products)
  db.serialize(() => {
    tables.forEach((table) => {
      db.run(table.query, (err) => {
        if (err) {
          console.error(`Error creating ${table.name} table:`, err.message);
        } else {
          console.log(`${table.name} table created or already exists.`);
        }
      });
    });
  });
});

// Close the database on process exit (optional, for cleanliness)
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    }
    console.log("Database connection closed.");
    process.exit(0);
  });
});

module.exports = db;