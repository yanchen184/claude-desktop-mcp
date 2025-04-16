const { contextBridge, ipcRenderer } = require('electron');

// Expose IPC functions to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Conversation history management
  getConversations: () => ipcRenderer.invoke('get-conversations'),
  saveConversation: (conversation) => ipcRenderer.invoke('save-conversation', conversation),
  
  // Settings management
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
});
