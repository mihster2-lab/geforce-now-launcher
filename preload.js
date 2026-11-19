const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("launcher", {
  launchEmbedded: () => ipcRenderer.invoke("launch-embedded"),
  launchBrowser: () => ipcRenderer.invoke("launch-browser"),
  toggleFullscreen: () => ipcRenderer.invoke("toggle-fullscreen")
});
