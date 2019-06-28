const electron = require('electron');
const path = require('path');

const {
  app,
  Tray,
  Menu
} = electron;

class TimerTray extends Tray {
  constructor(mainWindow) {
    const iconFile = process.platform === 'win32'
      ? 'windows-icon.png'
      : 'iconTemplate.png';

    const iconPath = path.join(__dirname, '..', 'src', 'assets', iconFile);

    super(iconPath);

    this.mainWindow = mainWindow;

    this.setToolTip('Timer app');

    this.addClickHandler();
    this.addRightClickHandler();
  }

  addClickHandler() {
    this.on('click', (event, bounds) => {
      if (this.mainWindow.isVisible()) {
        this.mainWindow.hide();
      } else {
        const { x, y, width: trayWidth } = bounds;
        const { height: windowHeight, width: windowWidth } = this.mainWindow.getBounds();

        const yPosition = process.platform === 'darwin'
          ? y
          : y - windowHeight;

        this.mainWindow.setBounds({
          height: windowHeight,
          width: windowWidth,
          x: x + trayWidth / 2 - windowWidth / 2,
          y: yPosition
        });

        this.mainWindow.show();
      }
    });
  }

  addRightClickHandler() {
    this.on('right-click', (event, bounds) => {
      const menuConfig = Menu.buildFromTemplate([{
        label: 'Quit',
        click: () => app.quit()
      }]);

      this.popUpContextMenu(menuConfig);
    })
  }
}

module.exports = TimerTray;