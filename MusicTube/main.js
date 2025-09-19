const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL('http://localhost:3000');

  // 右クリックメニュー（コンテキストメニュー）を設定
  mainWindow.webContents.on('context-menu', (_, params) => {
    const menu = Menu.buildFromTemplate([
      { role: 'cut', label: '切り取り', enabled: params.editFlags.canCut },
      { role: 'copy', label: 'コピー', enabled: params.editFlags.canCopy },
      { role: 'paste', label: '貼り付け', enabled: params.editFlags.canPaste },
      { type: 'separator' },
      { role: 'selectAll', label: 'すべて選択' }
    ]);
    menu.popup();
  });
}

// 上部メニュー（編集）も設定
const template = [
  {
    label: '編集',
    submenu: [
      { role: 'undo', label: '元に戻す' },
      { role: 'redo', label: 'やり直し' },
      { type: 'separator' },
      { role: 'cut', label: '切り取り' },
      { role: 'copy', label: 'コピー' },
      { role: 'paste', label: '貼り付け' },
      { role: 'selectAll', label: 'すべて選択' }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.whenReady().then(() => {
  const server = spawn('node', ['server.js'], {
    cwd: __dirname,
    shell: true,
    stdio: 'inherit',
  });

  setTimeout(createWindow, 1000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
