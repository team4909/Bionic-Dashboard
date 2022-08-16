"use strict";
const {app, BrowserWindow, globalShortcut, ipcMain} = require("electron");

const ntClient = require("wpilib-nt-client");

const roborio_hostname = "localhost"; // roborio-4909.local or something 
const client = new ntClient.Client();

let mainWindow;

const setUpNT = () => {
	client.start(
		(isConnected, error, is2_0) => {
			console.log({isConnected, error, is2_0}); 
			if (isConnected)
				mainWindow.webContents.send("connected", true);
			else
				client.setReconnectDelay(5000);
		},
		roborio_hostname
	);

	ipcMain.on("ready", () => {
		console.log("NetworkTables Initialized");
		// The returned type parameter is used by the api as the channel name
		client.addListener((key, value, valueType, type, id, flags) => {
			mainWindow.webContents.send(type, { key, value, valueType, id, flags });
		}, true);
	});

	ipcMain.on("add", (ev, mesg) => {
		client.Assign(mesg.val, mesg.key, (mesg.flags & 1) === 1);
	});
	ipcMain.on("update", (ev, mesg) => {
		client.Update(mesg.id, mesg.val);
	});
};

const createWindow = () => {
	mainWindow = new BrowserWindow({
		title: "Loading...",
		width: 1280,
		height: 720,
		closable: true,
		backgroundColor: "#2e2c29",
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		}
	});

	mainWindow.loadFile("src/index.html");
	globalShortcut.register("F5", () => { mainWindow.reload(); });
	
};

app.whenReady().then(() => {
	setUpNT();
	createWindow();

});



app.on("window-all-closed", () => {
	// client.removeListener(() => {});
});
