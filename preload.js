const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loginUser: (loginData) => ipcRenderer.invoke("loginUser", loginData),
  signupUser: (signupData) => ipcRenderer.invoke("signupUser", signupData),
  getUsers: () => ipcRenderer.invoke("getUsers"),
  deleteAllUsers: () => ipcRenderer.invoke("deleteAllUsers"),
  deleteUser: (id) => ipcRenderer.invoke("deleteUser", { id }),
  // Products
  saveProductImage: async (file) => {
    const buffer = await file.arrayBuffer();
    return ipcRenderer.invoke("saveProductImage", {
      name: file.name,
      buffer: Array.from(new Uint8Array(buffer)),
    });
  },
  addProduct: (productData) => ipcRenderer.invoke("addProduct", productData), // add products
  getProducts: () => ipcRenderer.invoke("getProducts"), 
});