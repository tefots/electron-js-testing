const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    signupUser: (user) => ipcRenderer.invoke('signupUser', user),
    // Optional: Keep previous CRUD methods (remove if not needed)
    // createItem: (item) => ipcRenderer.invoke('create-item', item),
    // readItems: () => ipcRenderer.invoke('read-items'),
    // updateItem: (item) => ipcRenderer.invoke('update-item', item),
    // deleteItem: (id) => ipcRenderer.invoke('delete-item', id),
    on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
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
