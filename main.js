const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'database.db'));

// Create "users" table if not exists
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    )
`);

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadURL('http://localhost:3000'); // Adjust this if necessary
});

// Handle user signup
ipcMain.handle('signup-user', async (event, user) => {
    try {
        const stmt = db.prepare(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)'
        );
        const result = stmt.run(user.username, user.email, user.password, user.role);
        return { success: true, id: result.lastInsertRowid };
    } catch (error) {
        return { success: false, error: error.message };
    }
});
