
const {app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const ntClient = require("wpilib-nt-client");

const roborio_hostname = "localhost"; // roborio-4909.local or something 
const client = new ntClient.Client();

let mainWindow;
let ntInitialized = false;

// TODO make this handle robot disconnects and reconnects
// the ntInitialized and listener variable manage state between hot reloads.
const setUpNT = () => {
	
	let listener;
	function createListener() {
		// The returned type parameter is used by the api as the channel name
		listener = client.addListener((key, val, valType, msgType, id, flags) => {
			mainWindow.webContents.send(msgType, { key, val, valType, id, flags });
		}, true);
	}

	ipcMain.on("ready", () => {
		if (!ntInitialized) {
			client.start(
				(isConnected, error, is2_0) => {
					console.log({isConnected, error, is2_0}); 
					if (isConnected) {
						mainWindow.webContents.send("connected", true);
						ntInitialized = true;
					}
					else client.setReconnectDelay(5000);
				},
				roborio_hostname
			);
			createListener();
			console.log("NetworkTables Initialized");
		} else {
			client.removeListener(listener);
			createListener();
			mainWindow.webContents.send("connected", true);
		}
	});

	ipcMain.on("add", (_ev, mesg) => {
		client.Assign(mesg.val, mesg.key, (mesg.flags & 1) === 1);
	});
	ipcMain.on("update", (_ev, mesg) => {
		client.Update(mesg.id, mesg.val);
	});
};

const createWindow = () => {
	mainWindow = new BrowserWindow({
		title: "loading very quickly...",
		width: 1280,
		height: 720,
		closable: true,
		backgroundColor: "#2e2c29",
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, "../src/preload.js"),
		}
	});

	mainWindow.loadURL(
		isDev 
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "../build.index.html")}`
	);

	globalShortcut.register("F5", () => { mainWindow.reload(); });
	
};

app.whenReady().then(async () => {
	createWindow();

	mainWindow.webContents.on("did-finish-load", () => {
		setUpNT();
	});
});

app.on("window-all-closed", () => {
	app.quit();
});
