// this is IPC handlers
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    loginUser: (loginData) => ipcRenderer.invoke('loginUser', loginData), // handles login logic
    signupUser: (signupData) => ipcRenderer.invoke('signupUser', signupData),// handles signup logic
    getUsers: () => ipcRenderer.invoke('getUsers'), // handles retrieval of all users
    deleteAllUsers: () => ipcRenderer.invoke('deleteAllUsers'), // handles deletion of all users
    deleteUser: (id) => ipcRenderer.invoke("delete-user", id),

    // products
    addProduct: (addProductData) => ipcRenderer.invoke('addProduct', addProductData), // this handles addition of products
    
});

// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("api", {
//   getUsers: () => ipcRenderer.invoke("get-users"),
// //   addUser: (user) => ipcRenderer.invoke("add-user", user),
// //   deleteUser: (id) => ipcRenderer.invoke("delete-user", id),
// });
// preload.ts (Electron)
// import { contextBridge, ipcRenderer } from "electron";

// contextBridge.exposeInMainWorld("electronAPI", {
//   signupUser: (userData) => ipcRenderer.invoke("signup-user", userData),
// });
