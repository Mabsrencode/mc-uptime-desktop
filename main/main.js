const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

let mainWindow;
let splashScreen;

const createWindow = async () => {
  Menu.setApplicationMenu(null);

  splashScreen = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
  });

  splashScreen.loadFile(path.join(__dirname, "../public/splash.html"));

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    // fullscreen: true,
    icon: path.join(__dirname, "../public/icon.ico"),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: !app.isPackaged,
    },
  });

  if (app.isPackaged) {
    const serve = (await import("electron-serve")).default;
    const appServe = serve({ directory: path.join(__dirname, "../out") });

    await appServe(mainWindow);
    mainWindow.loadURL("app://-");
  } else {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.on("did-fail-load", () => {
      mainWindow.webContents.reloadIgnoringCache();
    });
  }

  mainWindow.once("ready-to-show", () => {
    splashScreen.close();
    mainWindow.show();
  });
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
