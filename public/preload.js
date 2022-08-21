const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
	sendReady: () => ipcRenderer.send("ready"),
	sendAdd: (mesg) => ipcRenderer.send("add", mesg),
	sendUpdate: (mesg) => ipcRenderer.send("update", mesg),
	onConnected: (f) => ipcRenderer.on("connected", (ev, con) => f(ev, con)),
	onAdd: (f) => ipcRenderer.on("add", (ev, mesg) => f(ev, mesg)),
	onDelete: (f) => ipcRenderer.on("delete", (ev, mesg) => f(ev, mesg)),
	onUpdate: (f) => ipcRenderer.on("update", (ev, mesg) => f(ev, mesg)),
	onFlagChange: (f) => ipcRenderer.on("flagChange", (ev, mesg) => f(ev, mesg)),
});