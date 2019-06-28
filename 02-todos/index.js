const electron = require('electron');

const {
  app,
  BrowserWindow,
  Menu,
  ipcMain
} = electron;

let mainWindow,
    addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    title: 'Todos',
    webPreferences: { nodeIntegration: true }
  });

  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('close', app.quit);

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('todo:add', (event, todo) => {
  addWindow.close();
  mainWindow.webContents.send('todo:add', todo);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    title: 'Add New Todo',
    width: 300,
    height: 200,
    webPreferences: { nodeIntegration: true }
  });

  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on('close', () => addWindow = null);
}

const macMenuFix = () => process.platform === 'darwin' ? [{}] : [];

const devMenu = () => {
  return process.env.NODE_ENV === 'production'
    ? []
    : [{
      label: 'Development',
      submenu: [{
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin'
          ? 'Command+Alt+I'
          : 'F12',
        click: (item, focusedWindow) => focusedWindow.toggleDevTools()
      }, {
        role: 'reload',
        accelerator: process.platform === 'darwin'
          ? 'Command+R'
          : 'Ctrl+R'
      }, {
        role: 'forceReload',
        accelerator: process.platform === 'darwin'
          ? 'Command+Shift+R'
          : 'Ctrl+Shift+R'
      }]
    }]
};

const menuTemplate = [
  ...macMenuFix(),
  {
    label: 'File',
    submenu: [{
      label: 'New todo',
      click: createAddWindow
    }, {
      label: 'Clear Todos',
      click: () => mainWindow.webContents.send('todo:clear')
    }, {
      label: 'Quit',
      accelerator: process.platform === 'darwin'
        ? 'Command+Q'
        : 'Esc',
      click: app.quit
    }]
  },
  ...devMenu()
];

