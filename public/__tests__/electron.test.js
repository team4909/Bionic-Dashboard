const { _electron: electron } = require("playwright");
const { test } = require("@playwright/test");

test.only("launch app", async () => {
	const electronApp = await electron.launch({ args: ["./public/electron.js"] });
	await electronApp.close();
});
