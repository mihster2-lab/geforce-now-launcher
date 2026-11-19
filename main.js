const {
  app,
  BrowserWindow,
  ipcMain,
  shell
} = require("electron");

const path = require("path");

const GFN_URL = "https://play.geforcenow.com/";

let mainWindow;
let gamingWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1150,
    height: 760,
    minWidth: 850,
    minHeight: 600,
    backgroundColor: "#101419",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile("index.html");
}

function launchEmbedded() {
  if (gamingWindow && !gamingWindow.isDestroyed()) {
    gamingWindow.focus();
    return;
  }

  gamingWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    backgroundColor: "#101419",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  gamingWindow.loadURL(GFN_URL);

  gamingWindow.on("closed", () => {
    gamingWindow = null;
  });
}

app.whenReady().then(() => {
  createMainWindow();

  ipcMain.handle("launch-embedded", () => {
    launchEmbedded();
  });

  ipcMain.handle("launch-browser", () => {
    return shell.openExternal(GFN_URL);
  });

  ipcMain.handle("toggle-fullscreen", () => {
    if (gamingWindow && !gamingWindow.isDestroyed()) {
      gamingWindow.setFullScreen(
        !gamingWindow.isFullScreen()
      );
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
