const { app, BrowserWindow } = require("electron");
const path = require("path");

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: !app.isPackaged,
    },
  });

  if (app.isPackaged) {
    const serve = (await import("electron-serve")).default;
    const appServe = serve({ directory: path.join(__dirname, "../out") });

    await appServe(win);
    win.loadURL("app://-");
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.whenReady().then(() => {
  createWindow();
});
app.on("ready", () => {
  console.error = (msg) => {
    if (
      msg.includes("Autofill.enable") ||
      msg.includes("Autofill.setAddresses")
    ) {
      return;
    }
    console.log(msg);
  };
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
