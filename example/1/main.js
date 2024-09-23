const { app, BrowserWindow } = require("electron"); // Electron'dan 'app' ve 'BrowserWindow' modüllerini yüklüyoruz.
const path = require("path"); // Node.js'in 'path' modülünü kullanarak dosya ve dizin yollarını yönetiyoruz.

function createWindow() {
  // Yeni bir tarayıcı penceresi oluşturuyoruz.
  const mainWindow = new BrowserWindow({
    transparent: true, // Pencerenin arka planı şeffaf olacak.
    frame: false, // Pencere çerçevesi ve başlık çubuğu olmayacak.
    fullscreen: true, // Pencere tam ekran olacak.
    alwaysOnTop: true, // Pencere her zaman diğer uygulamaların üstünde duracak.

    skipTaskbar: false, // Pencere görev çubuğunda görünecek.

    resizable: false, // Kullanıcı pencereyi yeniden boyutlandıramayacak.
    fullscreenable: true, // Pencere tam ekran yapılabilir.
    maximizable: false, // Pencere maksimize edilemez.
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Preload betiği tanımlanıyor, bu sayede ana süreç ile render süreci arasında köprü kuruluyor.
      nodeIntegration: true, // Node.js modüllerinin tarayıcı penceresinde kullanılmasına izin veriyoruz.
      contextIsolation: false, // Tarayıcı penceresi ile ana süreç aynı JavaScript ortamını kullanacak, izolasyon yapılmayacak.
    },
  });

  // Pencerenin fare olaylarını yok sayıyoruz, böylece pencere fare etkileşimlerine kapalı olur.
  mainWindow.setIgnoreMouseEvents(true);

  // Pencereye HTML içeriği yüklüyoruz.
  mainWindow.loadFile("index.html");
}

// Uygulama hazır olduğunda bu fonksiyon çalıştırılır.
app.whenReady().then(() => {
  // Electron'da CORS sınırlamalarını kaldırıyoruz.
  app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

  // Pencereyi oluşturmak için 'createWindow' fonksiyonunu çağırıyoruz.
  createWindow();

  // Uygulama yeniden aktif olduğunda, açık pencere yoksa yeni bir pencere oluşturuyoruz.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Tüm pencereler kapatıldığında uygulamayı kapatıyoruz (macOS hariç).
// MacOS'ta uygulama pencereleri kapansa bile uygulama aktif kalır, bu nedenle 'darwin' platformu dışında uygulamayı kapatıyoruz.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
