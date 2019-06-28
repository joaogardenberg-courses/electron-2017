const electron = require('electron');

const {
  app,
  ipcMain
} = electron;

const MainWindow = require('./app/mainWindow');
const TimerTray = require('./app/timerTray');

let mainWindow,
    tray;

app.on('ready', () => {
  mainWindow = new MainWindow(`file://${__dirname}/src/index.html`);
  tray = new TimerTray(mainWindow);
});

ipcMain.on('update-timer', (event, timeLeft) => {
  tray.setTitle(timeLeft);
});