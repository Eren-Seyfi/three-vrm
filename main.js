const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800, // Pencerenin başlangıç genişliği
    height: 600, // Pencerenin başlangıç yüksekliği
    transparent: true, // Pencerenin arka planını şeffaf yapar
    frame: false, // Pencere çerçevesini (üst barı) gizler
    resizable: true, // Pencerenin yeniden boyutlandırılmasına izin verir
    fullscreenable: false, // Pencerenin tam ekran moduna geçmesini engeller
    alwaysOnTop: false, // Pencerenin diğer uygulamaların üstünde olmamasını sağlar (arka planda kalacak)
    skipTaskbar: true, // Pencerenin görev çubuğunda görünmemesini sağlar (gizler)
    autoHideMenuBar: true, // Menü çubuğunu otomatik olarak gizler
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Preload dosyasını belirtir (tarayıcıda çalışan özel scriptler için)
      nodeIntegration: true, // Node.js API'lerini tarayıcıda kullanılabilir yapar
      contextIsolation: false, // Tarayıcı ve ana süreç arasında kod izolasyonunu kapatır (Node.js kodlarına direkt erişim sağlar)
    },
  });

  // Pencereyi ekranın tamamını kaplayacak şekilde boyutlandırıyoruz
  const { width, height } = require("electron").screen.getPrimaryDisplay().workAreaSize;
  mainWindow.setSize(width, height); // Pencereyi ekranın tam boyutuna ayarlıyoruz
  mainWindow.setPosition(0, 0); // Pencereyi ekranın sol üst köşesine yerleştiriyoruz

  // Mouse olaylarını yok say - böylece arka planda olup masaüstü simgeleri ve klasörlerle etkileşime izin verir
  mainWindow.setIgnoreMouseEvents(true);

  // Pencereyi en arka planda tutuyoruz (screen-saver z-index'inde)
  mainWindow.setAlwaysOnTop(false, "screen-saver");

  // VRM karakterimizin görüntülendiği HTML dosyasını yüklüyoruz
  mainWindow.loadFile("index.html");
}

// Electron uygulaması hazır olduğunda pencereyi oluşturuyoruz
app.whenReady().then(() => {
  createWindow();

  // Eğer uygulama yeniden etkinleştirilirse (macOS'ta) ve hiçbir pencere yoksa, yeni bir pencere oluşturuyoruz
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Tüm pencereler kapandığında uygulamayı kapatıyoruz (macOS harici)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit(); // Uygulama kapanır
  }
});
