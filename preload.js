// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("api", {
//   getUsers: () => ipcRenderer.invoke("get-users"),
// //   addUser: (user) => ipcRenderer.invoke("add-user", user),
// //   deleteUser: (id) => ipcRenderer.invoke("delete-user", id),
// });
// preload.ts (Electron)
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  signupUser: (userData) => ipcRenderer.invoke("signup-user", userData),
});
