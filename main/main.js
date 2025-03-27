const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

let mainWindow;
let splashScreen;

const createWindow = async () => {
  // Menu.setApplicationMenu(null);

  splashScreen = new BrowserWindow({
    width: 400,
    height: 500,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
  });

  splashScreen.loadFile(path.join(__dirname, "../public/splash.html"));

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 1200,
    minHeight: 700,
    icon: path.join(__dirname, "../public/icon.ico"),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: !app.isPackaged,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true,
    },
  });

  if (app.isPackaged) {
    const serve = (await import("electron-serve")).default;
    const appServe = serve({ directory: path.join(__dirname, "../out") });

    await appServe(mainWindow);
    mainWindow.loadURL("app://./index.html");
  } else {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.on("did-fail-load", () => {
      mainWindow.webContents.reloadIgnoringCache();
    });
  }

  mainWindow.once("ready-to-show", () => {
    if (splashScreen && !splashScreen.isDestroyed()) {
      splashScreen.close();
    }
    mainWindow.show();
  });

  mainWindow.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
      const isDev = !app.isPackaged;
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [
            `script-src 'self' ${
              isDev
                ? "'unsafe-inline' 'unsafe-eval'"
                : "'nonce-randomStringHere'"
            }; 
             style-src 'self' 'unsafe-inline'; 
             font-src 'self'; 
             connect-src 'self' ${isDev ? "ws://localhost:*" : ""}; 
             frame-src 'none';`,
          ],
        },
      });
    }
  );
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
