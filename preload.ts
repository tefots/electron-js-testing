import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  addUser: (user: { username: string; email: string; role: string; password: string }) =>
    ipcRenderer.invoke('add-user', user),
  getUsers: () => ipcRenderer.invoke('get-users'),
});
