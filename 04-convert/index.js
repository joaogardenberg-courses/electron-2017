const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');

const {
  app,
  BrowserWindow,
  ipcMain,
  shell
} = electron;

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(`file://${__dirname}/src/index.html`);
});

ipcMain.on('videos:added', (event, videos) => {
  Promise.all(
    videos.map((video) => new Promise((resolve, reject) => {
      ffmpeg.ffprobe(video.path, (err, metadata) => {
        resolve({
          ...video,
          duration: metadata.format.duration,
          format: 'avi'
        });
      });
    }))
  ).then((results) => mainWindow.webContents.send('videos:added', results));
});

ipcMain.on('conversion:start', (event, videos) => {
  videos.forEach((video) => {
    const outputDirectory = video.path.split(video.name)[0];
    const outputName = video.name.split('.')[0];
    const outputPath = `${outputDirectory}${outputName}.${video.format}`;

    ffmpeg(video.path)
      .output(outputPath)
      .on('progress', ({ timemark }) => mainWindow.webContents.send('conversion:progress', { video, timemark }))
      .on('end', () => mainWindow.webContents.send('conversion:end', { video, outputPath }))
      .run();
  });
});

ipcMain.on('folder:open', (event, outputPath) => {
  shell.showItemInFolder(outputPath);
});