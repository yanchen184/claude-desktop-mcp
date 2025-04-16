const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Initialize store for saving settings and conversation history
const store = new Store();

// Create main application window
function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../public/favicon.svg'),
    backgroundColor: '#f9f5ff',
  });

  // Load the app
  if (app.isPackaged) {
    // Load production build
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    // Load from dev server in development
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  }
}

// Create window when Electron is ready
app.whenReady().then(() => {
  createWindow();

  // On macOS, recreate window when dock icon is clicked and no windows are open
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Handle IPC messages from renderer process
ipcMain.handle('get-conversations', () => {
  return store.get('conversations') || [];
});

ipcMain.handle('save-conversation', (_, conversation) => {
  const conversations = store.get('conversations') || [];
  store.set('conversations', [conversation, ...conversations]);
  return true;
});

ipcMain.handle('get-settings', () => {
  return store.get('settings') || { 
    apiKey: '',
    endpoint: 'https://api.anthropic.com',
    model: 'claude-3-opus-20240229',
  };
});

ipcMain.handle('save-settings', (_, settings) => {
  store.set('settings', settings);
  return true;
});
