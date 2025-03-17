const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getUsers: () => ipcRenderer.invoke("get-users"),
//   addUser: (user) => ipcRenderer.invoke("add-user", user),
//   deleteUser: (id) => ipcRenderer.invoke("delete-user", id),
});
