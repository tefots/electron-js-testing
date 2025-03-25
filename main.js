const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Login user IPC Handler
ipcMain.handle('loginUser', async (event, { username, password }) => {
  return new Promise((resolve) => {
      db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
          if (err) {
              resolve({ success: false, error: err.message });
          } else if (!row) {
              resolve({ success: false, error: "Invalid username or password" });
          } else {
              resolve({ 
                  success: true,
                  user: {
                      name: row.username, // Using username as name
                      email: row.email,
                      role: row.role,
                  }
              });
          }
      });
  });
});

// Signup User IPC Handler (unchanged)
ipcMain.handle('signupUser', async (event, { username, email, password, role }) => {
    return new Promise((resolve) => {
        db.run(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, password, role || 'user'],
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

// // Optional: Keep previous CRUD handlers for "items" (remove if not needed)
// ipcMain.on('create-item', (event, { name, description }) => {
//     db.run('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], function (err) {
//         if (err) {
//             event.reply('error', err.message);
//         } else {
//             event.reply('item-created', { id: this.lastID, name, description });
//         }
//     });
// });

// ipcMain.on('read-items', (event) => {
//     db.all('SELECT * FROM items', [], (err, rows) => {
//         if (err) {
//             event.reply('error', err.message);
//         } else {
//             event.reply('items', rows);
//         }
//     });
// });

// ipcMain.on('update-item', (event, { id, name, description }) => {
//     db.run('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description, id], function (err) {
//         if (err) {
//             event.reply('error', err.message);
//         } else {
//             event.reply('item-updated', { id, name, description });
//         }
//     });
// });

// ipcMain.on('delete-item', (event, id) => {
//     db.run('DELETE FROM items WHERE id = ?', [id], function (err) {
//         if (err) {
//             event.reply('error', err.message);
//         } else {
//             event.reply('item-deleted', id);
//         }
//     });
// });

// //import { ipcMain } from "electron";
// const { signupUser } = require("./db") // Function that handles signup logic
// // import  signupUser  from "./db"; 
// const { app, BrowserWindow, ipcMain } = require('electron');

// const path = require('path');
// const Database = require('better-sqlite3');

// // Initialize SQLite database
// const db = new Database(path.join(__dirname, 'database.db'));

// // Create "users" table if not exists
// db.exec(`
//     CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         username TEXT NOT NULL,
//         email TEXT NOT NULL UNIQUE,
//         password TEXT NOT NULL,
//         role TEXT NOT NULL
//     )
// `);

// let mainWindow;

// app.whenReady().then(() => {
//     mainWindow = new BrowserWindow({
//         width: 800,
//         height: 600,
//         webPreferences: {
//             nodeIntegration: false,
//             contextIsolation: true,
//             preload: path.join(__dirname, 'preload.js'),
//         },
//     });

//     mainWindow.loadURL('http://localhost:3000'); // Adjust this if necessary
// });


// // adding an event listener
// ipcMain.handle("signup-user", async (_, userData) => {
//   try {
//     const result = await signupUser(userData);
//     return { success: true, userId: result.lastInsertRowid };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// });


// // Handle user signup
// // ipcMain.handle('signup-user', async (event, user) => {
// //     try {
// //         const stmt = db.prepare(
// //             'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)'
// //         );
// //         const result = stmt.run(user.username, user.email, user.password, user.role);
// //         return { success: true, id: result.lastInsertRowid };
// //     } catch (error) {
// //         return { success: false, error: error.message };
// //     }
// // });
