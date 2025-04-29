const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs").promises;
const db = require("./db");
const bcrypt = require("bcrypt");

// Create public/products directory
const productsDir = path.join(__dirname, "public", "products");
fs.mkdir(productsDir, { recursive: true }).catch((err) =>
  console.error("Failed to create products directory:", err)
);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Login user IPC Handler

ipcMain.handle("loginUser", async (event, { username, password }) => {
  try {
    const user = await new Promise((resolve, reject) => {
      db.get(
        `SELECT id, firstName, lastName, email, username, password, userType FROM users WHERE username = ?`,
        [username],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    if (!user) {
      return { success: false, error: "User not found" };
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { success: false, error: "Invalid password" };
    }
    return {
      success: true,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.userType,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Signup User IPC Handler
ipcMain.handle(
  "signupUser",
  async (
    event,
    { firstName, lastName, username, email, password, status, userType, phoneNumber }
  ) => {
    return new Promise((resolve) => {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          resolve({ success: false, error: err.message });
          return;
        }
        db.run(
          "INSERT INTO users (firstName, lastName, username, email, password, status, userType, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            firstName,
            lastName,
            username,
            email,
            hashedPassword,
            status || "Off",
            userType || "user",
            phoneNumber,
          ],
          function (err) {
            if (err) {
              resolve({ success: false, error: err.message });
            } else {
              resolve({ success: true, id: this.lastID });
            }
          }
        );
      });
    });
  }
);

// Get All Users IPC Handler
ipcMain.handle("getUsers", async () => {
  return new Promise((resolve) => {
    db.all(
      "SELECT id, firstName, lastName, status, userType, email, phoneNumber FROM users",
      [],
      (err, rows) => {
        if (err) {
          resolve({ success: false, error: err.message });
        } else {
          resolve({ success: true, users: rows });
        }
      }
    );
  });
});

// Delete All Users (except Admins)
ipcMain.handle("deleteAllUsers", async () => {
  return new Promise((resolve) => {
    db.run("DELETE FROM users WHERE userType != 'Admin'", (err) => {
      if (err) {
        resolve({ success: false, error: err.message });
      } else {
        resolve({ success: true });
      }
    });
  });
});

// Delete single User IPC Handler
ipcMain.handle("deleteUser", async (event, { id }) => {
  return new Promise((resolve) => {
    db.run(
      "DELETE FROM users WHERE id = ? AND userType != 'Admin'",
      [id],
      function (err) {
        if (err) {
          resolve({ success: false, error: err.message });
        } else if (this.changes === 0) {
          resolve({ success: false, error: "User not found" });
        } else {
          resolve({ success: true });
        }
      }
    );
  });
});

// Save Product Image IPC Handler
ipcMain.handle("saveProductImage", async (event, imageData) => {
  try {
    const { name, buffer } = imageData;
    // Sanitize and create unique file name
    const fileName = `${Date.now()}-${name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const filePath = path.join(productsDir, fileName);

    // Save the image file
    await fs.writeFile(filePath, Buffer.from(buffer));

    // Return relative URL
    return { success: true, imageURL: `/products/${fileName}` };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Add Product IPC Handler
ipcMain.handle(
  "addProduct",
  async (event, { productName, category, price, quantity, description, imageURL, creationDate }) => {
    return new Promise((resolve) => {
      db.run(
        "INSERT INTO products (productName, category, price, quantity, description, imageURL, creationDate) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [productName, category, price, quantity, description, imageURL || "", creationDate],
        function (err) {
          if (err) {
            resolve({ success: false, error: err.message });
          } else {
            resolve({ success: true, id: this.lastID });
          }
        }
      );
    });
  }
);

// Get All Products IPC Handler
ipcMain.handle("getProducts", async () => {
    return new Promise((resolve) => {
      db.all(
        "SELECT id, productName, category, price, quantity, description, imageURL FROM products",
        [],
        (err, rows) => {
          if (err) {
            resolve({ success: false, error: err.message });
          } else {
            resolve({ success: true, products: rows });
          }
        }
      );
    });
  });

// Delete Product IPC Handler
ipcMain.handle("deleteProduct", async (event, { id }) => {
    return new Promise((resolve) => {
      // First, get the product to retrieve its imageURL
      db.get("SELECT imageURL FROM products WHERE id = ?", [id], (err, row) => {
        if (err) {
          resolve({ success: false, error: err.message });
          return;
        }
        if (!row) {
          resolve({ success: false, error: "Product not found" });
          return;
        }
  
        // Delete the product from the database
        db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
          if (err) {
            resolve({ success: false, error: err.message });
            return;
          }
          if (this.changes === 0) {
            resolve({ success: false, error: "Product not found" });
            return;
          }
  
          // Optionally delete the associated image file
          if (row.imageURL) {
            const imagePath = path.join(__dirname, "public", row.imageURL);
            fs.unlink(imagePath).catch((err) => {
              console.error("Failed to delete image file:", err);
            });
          }
  
          resolve({ success: true, imageURL: row.imageURL });
        });
      });
    });
  });

  // Update Product IPC Handler
ipcMain.handle(
    "updateProduct",
    async (event, { id, productName, category, price, quantity, description, imageURL }) => {
      return new Promise((resolve) => {
        // First, get the current product to retrieve its existing imageURL
        db.get("SELECT imageURL FROM products WHERE id = ?", [id], (err, row) => {
          if (err) {
            resolve({ success: false, error: err.message });
            return;
          }
          if (!row) {
            resolve({ success: false, error: "Product not found" });
            return;
          }
  
          // Update the product in the database
          db.run(
            "UPDATE products SET productName = ?, category = ?, price = ?, quantity = ?, description = ?, imageURL = ? WHERE id = ?",
            [productName, category, price, quantity, description, imageURL || row.imageURL, id],
            function (err) {
              if (err) {
                resolve({ success: false, error: err.message });
                return;
              }
              if (this.changes === 0) {
                resolve({ success: false, error: "Product not found" });
                return;
              }
  
              // If a new image was uploaded, delete the old image file
              if (imageURL && row.imageURL && imageURL !== row.imageURL) {
                const oldImagePath = path.join(__dirname, "public", row.imageURL);
                fs.unlink(oldImagePath).catch((err) => {
                  console.error("Failed to delete old image file:", err);
                });
              }
  
              resolve({ success: true });
            }
          );
        });
      });
    }
  );

  // ==============================================
  // TRANSACTIONS
  // ==============================================

  // Add transaction IPC Handler
// IPC handler for inserting transactions
ipcMain.handle('insert-transaction', async (event, transaction) => {
  try {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO transactions (items, subtotal, discount, total, gst, paymentMethod, amountPaid, change, customerName, phoneNumber, cardNumber, transactionDate, loggedInUser)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          transaction.items,
          transaction.subtotal,
          transaction.discount,
          transaction.total,
          transaction.gst,
          transaction.paymentMethod,
          transaction.amountPaid,
          transaction.change,
          transaction.customerName,
          transaction.phoneNumber,
          transaction.cardNumber,
          transaction.transactionDate,
          transaction.loggedInUser,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// IPC Handler for fetching transactions
// ipcMain.handle('getTransactions', async (event) => {
//   try {
//     const query = `
//       SELECT 
//         id, 
//         items, 
//         subtotal, 
//         discount, 
//         total, 
//         gst, 
//         paymentMethod, 
//         amountPaid, 
//         change, 
//         customerName, 
//         phoneNumber, 
//         cardNumber, 
//         transactionDate, 
//         loggedInUser 
//       FROM transactions
//       ORDER BY transactionDate DESC
//     `;

//     // Execute the query and return the results
//     return new Promise((resolve, reject) => {
//       db.all(query, [], (err, rows) => {
//         if (err) {
//           console.error('Error fetching transactions:', err.message);
//           reject({ success: false, error: err.message });
//         } else {
//           resolve({ success: true, data: rows });
//         }
//       });
//     });
//   } catch (error) {
//     console.error('Error in getTransactions handler:', error);
//     return { success: false, error: error.message };
//   }
// });

// user ids from users table
ipcMain.handle("fetch-users", async () => {
  return new Promise((resolve) => {
    db.all(
      "SELECT id FROM users",
      [],
      (err, rows) => {
        if (err) {
          resolve({ success: false, error: err.message });
        } else {
          resolve({ success: true, users: rows });
        }
      }
    );
  });
});


ipcMain.handle('get-transactions', async (event, userId) => {
  try {

    let transactions;
    if (userId) {
      transactions = db.prepare('SELECT * FROM transactions WHERE loggedInUser = ? ORDER BY transactionDate DESC').all(userId);
    } else {
      transactions = db.prepare('SELECT * FROM transactions ORDER BY transactionDate DESC').all();
    }

    return { success: true, data: transactions };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
