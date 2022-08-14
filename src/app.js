"use strict";
const {app, BrowserWindow, globalShortcut} = require("electron");

const ntClient = require("wolfbyte-networktables");

const hostname = "127.0.0.1";
const port = 3000;
const roborio_hostname = "localhost"; // roborio-4909.local or something 

const client = new ntClient.Client();

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		closable: true
		
	});
	mainWindow.loadFile("src/index.html");
	globalShortcut.register("F5", () => { mainWindow.reload(); });
	
};

client.start(
	(isConnected, error) => { console.log({isConnected, error}); },
	roborio_hostname
);

app.whenReady().then(() => {
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});

});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});