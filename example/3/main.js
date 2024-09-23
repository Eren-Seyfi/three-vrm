const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800, // Başlangıç boyutu
    height: 600, // Başlangıç boyutu
    transparent: true, // Pencerenin arka planı şeffaf olacak
    frame: false, // Pencerenin çerçevesi olmayacak
    resizable: true, // Pencere boyutlandırılabilir
    fullscreenable: false, // Pencere tam ekran yapılamaz
    alwaysOnTop: false, // Diğer uygulamaların üzerine çıkmasın
    skipTaskbar: false, // Pencere görev çubuğunda gözükmeyecek
    autoHideMenuBar: true, // Menü çubuğunu gizle
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true, // Node.js modüllerine tarayıcıdan erişim
      contextIsolation: false,
    },
  });

  // Pencereyi ekranın tamamını kaplayacak şekilde boyutlandırıyoruz, ancak tam ekran yapmıyoruz.
  const { width, height } =
    require("electron").screen.getPrimaryDisplay().workAreaSize;
  mainWindow.setSize(width, height);
  mainWindow.setPosition(0, 0); // Ekranın sol üst köşesine yerleştir
  mainWindow.setIgnoreMouseEvents(true);
  //   mainWindow.openDevTools();
  mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
