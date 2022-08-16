"use strict";
const {app, BrowserWindow, globalShortcut, ipcMain} = require("electron");

const ntClient = require("wpilib-nt-client");

const roborio_hostname = "localhost"; // roborio-4909.local or something 
const client = new ntClient.Client();

const ipc = ipcMain;

// client.start(
// 	(isConnected, error, is2_0) => { console.log({isConnected, error, is2_0}); },
// 	roborio_hostname
// );

// client.addListener((key, value, valueType, type, id) => {
// 	console.log({ key, value, valueType, type, id });
// }, true);

// client.Update("/SmartDashboard/Test Value2", false);
// console.log(client.getEntries());

try {
	client.Update(client.getKeyID("/Test"), 5);
} catch (ex) {
	console.log(ex);
}

let mainWindow;

let connectedFunc, ready = false;

let clientDataListener = (key, val, valType, mesgType, id, flags) => {
	if (val === "true" || val === "false") {
		val = val === "true";
	}
	mainWindow.webContents.send(mesgType, {
		key,
		val,
		valType,
		id,
		flags
	});
};

const createWindow = () => {
	ipc.on("ready", (ev, mesg) => {
		console.log("NetworkTables is ready");
		ready = mainWindow != null;

		// Remove old Listener
		client.removeListener(clientDataListener);

		// Add new listener with immediate callback
		client.addListener(clientDataListener, true);

		// Send connection message to the window if if the message is ready
		if (connectedFunc) connectedFunc();
	});
	// When the user chooses the address of the bot than try to connect
	// ipc.on("connect", (ev, address, port) => {
	// 	console.log(`Trying to connect to ${address}` + (port ? ":" + port : ""));
	// 	let callback = (connected, err) => {
	// 		console.log("Sending status");
	// 		mainWindow.webContents.send("connected", connected);
	// 	};
	// 	if (port) {
	// 		client.start(callback, address, port);
	// 	} else {
	// 		client.start(callback, address);
	// 	}
	// });

	client.start(
		(isConnected, error, is2_0) => { console.log({isConnected, error, is2_0}); },
		roborio_hostname
	);
	ipc.on("add", (ev, mesg) => {
		client.Assign(mesg.val, mesg.key, (mesg.flags & 1) === 1);
	});
	ipc.on("update", (ev, mesg) => {
		client.Update(mesg.id, mesg.val);
	});
	ipc.on("windowError", (ev, error) => {
		console.log(error);
	});

	mainWindow = new BrowserWindow({
		title: "Loading...",
		width: 1280,
		height: 720,
		closable: true,
		backgroundColor: "#2e2c29",
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
		}
	});
	mainWindow.loadFile("src/index.html");
	globalShortcut.register("F5", () => { mainWindow.reload(); });
	
};

app.whenReady().then(() => {
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});

});

app.on("window-all-closed", () => {
	
	if (process.platform !== "darwin") app.quit();
});
