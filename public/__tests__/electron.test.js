const { _electron: electron } = require("playwright");
const { test } = require("@playwright/test");

test("launch app", async () => {
	const electronApp = await electron.launch({ args: ["./public/electron.js"] });
	await electronApp.close();
});
