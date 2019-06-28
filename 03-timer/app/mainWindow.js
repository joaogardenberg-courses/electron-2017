const electron = require('electron');

const {
  app,
  BrowserWindow
} = electron;

class MainWindow extends BrowserWindow {
  constructor(url) {
    super({
      height: 500,
      width: 300,
      frame: false,
      resizable: false,
      show: false,
      webPreferences: {
        backgroundThrottling: false,
        nodeIntegration: true
      }
    });

    process.platform === 'win32' ? this.setSkipTaskbar(true) : app.dock.hide();

    this.loadURL(url);

    this.addBlurHandler();
  }

  addBlurHandler() {
    this.on('blur', () => {
      this.hide();
    });
  }
}

module.exports = MainWindow;