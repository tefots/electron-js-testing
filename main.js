const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db');
const bcrypt = require('bcrypt');

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
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                resolve({ success: false, error: err.message });
            } else if (!row) {
                resolve({ success: false, error: "Invalid username or password" });
            } else {
                bcrypt.compare(password, row.password, (err, result) => {
                    if (err) {
                        resolve({ success: false, error: err.message });
                    } else if (result) {
                        resolve({
                            success: true,
                            user: {
                                name: row.username,
                                email: row.email,
                                role: row.userType || 'user',
                            },
                        });
                    } else {
                        resolve({ success: false, error: "Invalid username or password" });
                    }
                });
            }
        });
    });
});

// Signup User IPC Handler
ipcMain.handle('signupUser', async (event, { firstName, lastName, username, email, password, status, userType, phoneNumber }) => {
    return new Promise((resolve) => {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                resolve({ success: false, error: err.message });
                return;
            }
            db.run(
                'INSERT INTO users (firstName, lastName, username, email, password, status, userType, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [firstName, lastName, username, email, hashedPassword, status || 'Off', userType || 'user', phoneNumber],
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
});

// Get All Users IPC Handler
ipcMain.handle('getUsers', async () => {
    return new Promise((resolve) => {
        db.all('SELECT id, firstName, lastName, status, userType, email, phoneNumber FROM users', [], (err, rows) => {
            if (err) {
                resolve({ success: false, error: err.message });
            } else {
                resolve({ success: true, users: rows });
            }
        });
    });
});

// Delete All Users IPC Handler
// ipcMain.handle('deleteAllUsers', async () => {
//     return new Promise((resolve) => {
//         db.run('DELETE FROM users', (err) => {
//             if (err) {
//                 resolve({ success: false, error: err.message });
//             } else {
//                 resolve({ success: true });
//             }
//         });
//     });
// });

// Updated: Delete All Users (except Admins)
ipcMain.handle('deleteAllUsers', async () => {
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

// Delete single User  IPC Handler
ipcMain.handle('deleteUser', async (event, { id }) => {
    return new Promise((resolve) => {
        db.run("DELETE FROM users WHERE id = ? AND userType != 'Admin'", [id], function (err) {
            if (err) {
                resolve({ success: false, error: err.message });
            } else if (this.changes === 0) {
                resolve({ success: false, error: 'User not found' });
            } else {
                resolve({ success: true });
            }
        });
    });
});


// ===========================================================================
//                  PRODUCTS HANDLERS
// ===========================================================================

// logic to add product
ipcMain.handle('addProduct', async (event, {productName, quantity, price, image}) => {
    return new Promise((resolve) => {
        db.run(
            'INSERT INTO products (productName, quantity, price, imagePath) VALUES (?, ?, ?, ?)', 
            [productName, quantity, price, image],
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
    